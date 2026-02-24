import {SourceField} from '@sciflow/editor-start/dist/bundle/sciflow-editor.js';

/**
 * Dynamically inject a MathJax 4 tex-svg script tag if not already present.
 * The SciFlow math feature checks for window.MathJax.tex2svgPromise at render time.
 */
export function loadMathJax() {
	if (window.MathJax?.tex2svgPromise) return Promise.resolve();
	const existing = document.querySelector('script[data-mathjax4]');
	if (existing) {
		return new Promise((resolve) =>
			existing.addEventListener('load', resolve, {once: true}),
		);
	}
	return new Promise((resolve, reject) => {
		const script = document.createElement('script');
		script.src = 'https://cdn.jsdelivr.net/npm/mathjax@4/tex-svg.js';
		script.dataset.mathjax4 = '';
		script.async = true;
		script.onload = resolve;
		script.onerror = reject;
		document.head.appendChild(script);
	});
}

/**
 * Extract all cited reference IDs from a ProseMirror doc node.
 */
export function extractCitedIdsFromDoc(doc) {
	const citations = [];
	doc.descendants((node) => {
		if (node.type?.name !== 'citation') return;
		const entries = SourceField.fromString(node.attrs?.source ?? null);
		citations.push({source: entries});
	});
	return citations.flatMap((c) =>
		(c.source || [])
			.map((e) => (typeof e?.id === 'string' ? e.id.trim() : e?.id))
			.filter(Boolean),
	);
}

/**
 * Extract cited reference IDs within a ProseMirror selection range.
 */
export function extractReferencedIds(doc, selection) {
	if (!doc?.nodesBetween) return [];
	const from = Math.min(
		selection.anchor ?? selection.from ?? 0,
		selection.head ?? selection.to ?? 0,
	);
	const to = Math.max(
		selection.anchor ?? selection.from ?? 0,
		selection.head ?? selection.to ?? 0,
	);
	const citations = [];
	doc.nodesBetween(from, Math.max(to, from + 1), (node) => {
		if (node.type.name !== 'citation') return;
		const entries = SourceField.fromString(node.attrs?.source ?? null);
		citations.push({source: entries});
	});
	return citations.flatMap((c) =>
		(c.source || [])
			.map((e) => (typeof e?.id === 'string' ? e.id.trim() : e?.id))
			.filter(Boolean),
	);
}

/**
 * Warn in the console if a document references figure files or citations
 * that are not present in the provided file/reference lists.
 */
export function validateExternalResources(doc, files, references) {
	if (!doc || typeof doc !== 'object') return;
	const fileIds = new Set((files || []).map((f) => String(f.id)));
	const fileUrls = new Set((files || []).map((f) => f.url).filter(Boolean));
	const refIds = new Set((references || []).map((r) => String(r.id)));
	const missingFiles = new Set();
	const missingRefs = new Set();
	const visit = (node) => {
		if (!node || typeof node !== 'object') return;
		if (node.type === 'figure') {
			const src =
				typeof node?.attrs?.src === 'string' ? node.attrs.src.trim() : '';
			if (src && !fileIds.has(src) && !fileUrls.has(src)) missingFiles.add(src);
		}
		if (node.type === 'citation') {
			SourceField.fromString(node.attrs?.source ?? null).forEach((e) => {
				if (e?.id && !refIds.has(String(e.id))) missingRefs.add(String(e.id));
			});
		}
		if (Array.isArray(node.content)) node.content.forEach(visit);
	};
	visit(doc);
	if (missingFiles.size)
		console.warn('[sciflow] Missing figure resources:', [...missingFiles]);
	if (missingRefs.size)
		console.warn('[sciflow] Missing reference entries:', [...missingRefs]);
}

/**
 * Transform OJS publication citations to SciFlow reference format.
 * OJS citations have: id, rawCitation, authors (givenName, familyName), title, etc.
 * SciFlow expects: id (string), rawCitation or raw_citation, optionally author (given, family).
 */
export function transformCitationsForEditor(citations) {
	const result = (citations || []).map((c) => {
		const id = c?.id != null ? String(c.id) : '';
		const rawCitation =
			typeof c?.rawCitation === 'string'
				? c.rawCitation
				: typeof c?.raw_citation === 'string'
					? c.raw_citation
					: '';
		const author = Array.isArray(c?.authors)
			? c.authors.map((a) => ({
					given: a?.givenName ?? a?.given ?? '',
					family: a?.familyName ?? a?.family ?? '',
				}))
			: undefined;
		return {
			...c,
			id,
			rawCitation: rawCitation || c?.title || id,
			author,
		};
	});
	console.debug('[WorkflowPublicationBodyText] references from OJS:', {
		rawCount: (citations || []).length,
		transformedCount: result.length,
		source: citations ?? null,
		transformed: result,
	});
	return result;
}

/**
 * Stable JSON serialization of a document for dirty-state comparison.
 */
export function serializeDocument(doc) {
	if (!doc || typeof doc !== 'object') return '';
	try {
		return JSON.stringify(doc);
	} catch {
		return '';
	}
}
