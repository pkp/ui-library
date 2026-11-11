import {SourceField} from '@sciflow/editor-core';

/**
 * Throw an error if <cite> element has a missing or empty data-source attribute
 * or if the source points to nonexisting reference ID.
 */
export class ReferenceExportError extends Error {
	constructor(missingIds, invalidSources) {
		super('Unable to resolve body-text references.');
		this.name = 'ReferenceExportError';
		this.missingIds = missingIds;
		this.invalidSources = invalidSources;
	}
}

/**
 * Link citations to their references in the exported HTML.
 * Match numeric citation markers to the editor's reference-list numbers.
 * Add matching bibliography numbers while keeping reference content and styles.
 * Keep other citation text unchanged.
 * Do not change the editor document or publication metadata.
 */
export function exportBodyTextReferences(
	container,
	references = [],
	{heading, linkLabel},
) {
	const document = container.ownerDocument;
	const entries = new Map();
	container
		.querySelectorAll('[data-type="reference"][data-ref-id]')
		.forEach((entry) => {
			const id = entry.getAttribute('data-ref-id');
			entry.classList.add('body-text-reference');
			if (id && !entries.has(id)) entries.set(id, entry);
		});
	const referenceById = new Map(
		references
			.filter((reference) => reference?.id != null)
			.map((reference) => [String(reference.id), reference]),
	);
	const referenceNumbers = new Map(
		/**
		 * Create a map of the database reference Ids to the editor list numbers
		 * this ensures that in-text number corresponds to the correct reference in the bibliography,
		 * even if the references are not in order.
		 */
		[...referenceById.keys()].map((id, index) => [id, index + 1]),
	);
	const citations = [...container.querySelectorAll('cite')].map((citation) => {
		const source = citation.getAttribute('data-source');
		const items = SourceField.fromString(source);
		let valid = false;
		try {
			const decoded = JSON.parse(decodeURIComponent(source || ''));
			// SourceField filters malformed items; do not silently lose part of a group.
			valid =
				Array.isArray(decoded) &&
				items.length > 0 &&
				decoded.length === items.length;
		} catch {
			// Invalid sources are reported together with missing reference IDs below.
		}
		return {citation, items, valid};
	});
	const citedIds = [
		...new Set(citations.flatMap(({items}) => items.map(({id}) => id))),
	];
	const missingIds = citedIds.filter((id) => {
		const text = referenceById.get(id)?.rawReference;
		return !entries.has(id) && !(typeof text === 'string' && text.trim());
	});
	const invalidSources = citations.filter(({valid}) => !valid).length;
	if (missingIds.length || invalidSources) {
		throw new ReferenceExportError(missingIds, invalidSources);
	}

	/**
	 * Keep cited references in the editor's list order, not the order they
	 * 	appear in the text, so the exported bibliography matches the editor.
	 */
	const citedIdSet = new Set(citedIds);
	const orderedIds = [...referenceById.keys()].filter((id) =>
		citedIdSet.has(id),
	);
	// Also keep references that exist only in the document's bibliography.
	orderedIds.push(...citedIds.filter((id) => !referenceById.has(id)));

	const usedIds = new Set(
		[...container.querySelectorAll('[id]')].map((element) => element.id),
	);
	let lastEntry = [...container.querySelectorAll('[data-type="reference"]')].at(
		-1,
	);
	for (const id of orderedIds) {
		let entry = entries.get(id);
		if (!entry) {
			entry = document.createElement('p');
			entry.setAttribute('data-type', 'reference');
			entry.setAttribute('data-ref-id', id);
			entry.textContent = referenceById.get(id).rawReference;
			if (lastEntry) {
				// Extend an existing bibliography in place, without another heading.
				lastEntry.after(entry);
			} else {
				const bibliography = document.createElement('section');
				bibliography.className = 'body-text-references';
				bibliography.setAttribute('aria-label', heading);
				const title = document.createElement('h2');
				title.textContent = heading;
				bibliography.append(title, entry);
				container.appendChild(bibliography);
			}
			lastEntry = entry;
			entries.set(id, entry);
		}
		entry.classList.add('body-text-reference');
		// Show the citation number beside its reference so readers can match them
		// in printed PDFs too, even when uncited references are omitted.
		const number = referenceNumbers.get(id);
		if (number != null) updateBibliographyNumber(entry, number);
		if (!entry.id) {
			const baseId = `body-text-ref-${encodeURIComponent(id)}`;
			let anchor = baseId;
			let suffix = 1;
			while (usedIds.has(anchor)) anchor = `${baseId}-${suffix++}`;
			entry.id = anchor;
			usedIds.add(anchor);
		}
	}

	for (const {citation, items} of citations) {
		citation.classList.add('body-text-citation');
		const ids = [...new Set(items.map(({id}) => id))];
		// Keep manually entered citation text, including years like "(2021)".
		// Only generated markers should use the reference-list numbers.
		if (
			citation.getAttribute('data-citation-mode') !== 'custom' &&
			!items.some((item) => item.locator || item.prefix || item.suffix)
		) {
			updateNumericCitationMarker(
				citation,
				ids.map((id) => referenceNumbers.get(id)),
			);
		}
		const referenceLabel = (id) => linkLabel(referenceNumbers.get(id) ?? id);
		const createLink = (id) => {
			const link = document.createElement('a');
			link.href = `#${encodeURIComponent(entries.get(id).id)}`;
			link.setAttribute('aria-label', referenceLabel(id));
			return link;
		};
		if (
			ids.length === 1 &&
			!citation.querySelector('a') &&
			citation.textContent
		) {
			const link = createLink(ids[0]);
			link.append(...citation.childNodes);
			citation.appendChild(link);
		} else {
			/**
			 * According to citation model in Prosemirror, a citation may show a range like [1–3] or an author and year.
			 * keep cite element separate from the list of links to references and avoid nested links inside the cite element.
			 */
			const targets = document.createElement('span');
			targets.className = 'body-text-citation-targets';
			targets.append(' (');
			ids.forEach((id, index) => {
				if (index) targets.append('; ');
				const link = createLink(id);
				link.textContent = referenceLabel(id);
				targets.appendChild(link);
			});
			targets.append(')');
			citation.after(targets);
		}
	}
}

/** Add or correct a visible number without replacing the reference's formatting. */
function updateBibliographyNumber(entry, number) {
	const prefix = entry.textContent.match(
		/^\s*(?:\[(\d+)\]|\((\d+)\)|(\d+)[.)])(?=\s|$)/,
	);
	if (prefix) {
		const digits = prefix[1] ?? prefix[2] ?? prefix[3];
		if (digits === String(number)) return;
		const start = prefix[0].indexOf(digits);
		replaceTextRanges(entry, [
			{start, end: start + digits.length, text: String(number)},
		]);
		return;
	}
	// Use real text, not a CSS counter, so the number survives PDF conversion.
	const label = entry.ownerDocument.createElement('span');
	label.className = 'body-text-reference-number';
	label.textContent = `${number}. `;
	entry.prepend(label);
}

/**
 * Replace numeric in-text citation markers with the correct numbers from the editor's reference list.
 * e.g., if the in-text citation is the ref ID [34] but the actual editor's reference list has it as 12th reference  by the order, this function will update the in-text citation to [12].
 * This ensures that the exported HTML has consistent citation numbers that match the bibliography.
 */
function updateNumericCitationMarker(citation, numbers) {
	if (numbers.some((number) => number == null)) return;
	const match = citation.textContent.match(
		/^(\s*)(\[|\()?(\d+(?:\s*[,;–—-]\s*\d+)*)(\]|\))?(\s*)$/,
	);
	if (!match) return;
	const [, whitespace, opening = '', marker, closing = ''] = match;
	if (
		(opening === '[' && closing !== ']') ||
		(opening === '(' && closing !== ')') ||
		(!opening && closing)
	)
		return;
	const range = marker.match(/^\d+\s*([–—-])\s*\d+$/);
	// Mixed lists and ranges are ambiguous without a full citation formatter.
	if (!range && /[–—-]/.test(marker)) return;
	if (
		range ? numbers.length < 2 : marker.match(/\d+/g).length !== numbers.length
	)
		return;
	const consecutive = numbers.every(
		(number, index) => !index || number === numbers[index - 1] + 1,
	);
	const start = whitespace.length + opening.length;
	// Show references 1, 3, and 5 as a list, not "1–5", which would also include
	// references 2 and 4. Otherwise, keep the original commas, spaces, or dashes.
	const replacements =
		range && !consecutive
			? [{start, end: start + marker.length, text: numbers.join(', ')}]
			: [...marker.matchAll(/\d+/g)].map((token, index) => ({
					start: start + token.index,
					end: start + token.index + token[0].length,
					text: String(range && index ? numbers.at(-1) : numbers[index]),
				}));
	// Use each number's original position so replacing "34" with "4" does not
	// shift later replacements, even when a number is split across styled text.
	replaceTextRanges(citation, replacements);
}

/** Replace text at its original positions, keeping surrounding elements intact. */
function replaceTextRanges(element, replacements) {
	const walker = element.ownerDocument.createTreeWalker(
		element,
		element.ownerDocument.defaultView.NodeFilter.SHOW_TEXT,
	);
	let offset = 0;
	for (let node = walker.nextNode(); node; node = walker.nextNode()) {
		const text = node.nodeValue;
		let updated = text;
		for (const replacement of [...replacements].reverse()) {
			const from = Math.max(0, replacement.start - offset);
			const to = Math.min(text.length, replacement.end - offset);
			if (from < to) {
				updated =
					updated.slice(0, from) +
					(offset <= replacement.start ? replacement.text : '') +
					updated.slice(to);
			}
		}
		node.nodeValue = updated;
		offset += text.length;
	}
}

/** Shared by standalone HTML, PDF preview and PDF generation. */
export const bodyTextReferenceStyles = `
	.body-text-citation { font-style: normal; }
	.body-text-citation-targets { font-size: 0.85em; }
	.body-text-references { margin-block-start: 2em; }
	.body-text-reference { margin-block: 0.75em; overflow-wrap: anywhere; }
`;
