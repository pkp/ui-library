import {
	generatedCitationMarker,
	retainCitationMarker,
	citationMarkerReplacements,
	replaceCitationMarker,
} from './citationMarker.js';

/** Extend the local citation schema without changing SciFlow's schema files. */
export function createCitationMarkerFeature(
	citationSpec,
	Plugin,
	getReferences,
) {
	return {
		name: 'ojsCitationMarker',
		dependencies: ['citation'],
		priority: 1000,
		extendSchema() {
			return {
				nodes: {
					citation: {
						...citationSpec,
						attrs: {...citationSpec.attrs, ojsCitationMarker: {default: null}},
						toDOM(node) {
							const output = citationSpec.toDOM(node);
							return [
								output[0],
								{
									...output[1],
									'data-ojs-citation-marker': JSON.stringify(
										node.attrs.ojsCitationMarker,
									),
								},
								...output.slice(2),
							];
						},
						parseDOM: citationSpec.parseDOM.map((rule) => ({
							...rule,
							getAttrs(dom) {
								const attrs = rule.getAttrs?.(dom) ?? rule.attrs ?? {};
								if (attrs === false) return false;
								let ojsCitationMarker = null;
								try {
									ojsCitationMarker = JSON.parse(
										dom.getAttribute('data-ojs-citation-marker'),
									);
								} catch {
									/* Imported HTML may have no marker record. */
								}
								return {...attrs, ojsCitationMarker};
							},
						})),
					},
				},
			};
		},
		addPlugins() {
			return [
				new Plugin({
					appendTransaction(transactions, oldState, state) {
						if (
							!transactions.some(
								(tr) => tr.docChanged && !tr.getMeta('ojsCitationMarker'),
							)
						)
							return null;
						const previous = new Map();
						oldState.doc.descendants((node, position) => {
							if (node.type.name !== 'citation') return;
							for (const tr of transactions) {
								const mapped = tr.mapping.mapResult(position, 1);
								if (mapped.deleted) return;
								position = mapped.pos;
							}
							previous.set(position, node);
						});
						return citationMarkerTransaction(
							state,
							getReferences(),
							previous,
							transactions.some((tr) => tr.getMeta('ojsCitationDrop')),
						);
					},
				}),
			];
		},
	};
}

/** Also run after loading a document or changing the reference-list order. */
export function refreshCitationMarkers(view, references) {
	const tr = citationMarkerTransaction(view.state, references);
	if (tr) view.dispatch(tr.setMeta('addToHistory', false));
}

function citationMarkerTransaction(
	state,
	references,
	previous = new Map(),
	isDrop = false,
) {
	const numbers = new Map(references.map((ref, i) => [String(ref.id), i + 1]));
	const citations = [];
	state.doc.descendants((node, position) => {
		if (node.type.name === 'citation') citations.push({node, position});
	});
	const tr = state.tr;
	// Work backward so a longer number cannot shift an earlier citation.
	for (const {node, position} of citations.reverse()) {
		let marker = node.attrs.ojsCitationMarker;
		let citationMode = node.attrs.citationMode;
		const old = previous.get(position);
		if (
			!isDrop &&
			old &&
			old.attrs.source === node.attrs.source &&
			!old.content.eq(node.content)
		) {
			if (marker?.content !== node.textContent) {
				marker = retainCitationMarker(
					old.attrs.ojsCitationMarker ?? generatedCitationMarker(old),
					node.textContent,
				);
				citationMode = 'custom';
			}
		} else if (
			marker == null ||
			(old &&
				old.attrs.source !== node.attrs.source &&
				citationMode !== 'custom' &&
				marker?.content !== node.textContent)
		) {
			marker = generatedCitationMarker(node);
		}
		const replacements = citationMarkerReplacements(
			marker,
			node.textContent,
			node.attrs.source,
			numbers,
		);
		if (replacements.length) {
			const segments = textSegments(node, position + 1);
			for (const r of [...replacements].sort((a, b) => b.start - a.start)) {
				const from = textOffsetToPosition(segments, r.start, false);
				const to = textOffsetToPosition(segments, r.end, true);
				if (from != null && to != null) tr.insertText(r.text, from, to);
			}
			marker = replaceCitationMarker(marker, replacements);
		}
		if (
			JSON.stringify(marker) !== JSON.stringify(node.attrs.ojsCitationMarker) ||
			citationMode !== node.attrs.citationMode
		)
			tr.setNodeMarkup(position, undefined, {
				...node.attrs,
				citationMode,
				ojsCitationMarker: marker,
			});
	}
	return tr.docChanged ? tr.setMeta('ojsCitationMarker', true) : null;
}

/** Locate each text node, since textContent offsets differ from document positions. */
function textSegments(node, base) {
	const segments = [];
	let offset = 0;
	node.descendants((child, pos) => {
		if (!child.isText) return;
		segments.push({offset, length: child.text.length, pos: base + pos});
		offset += child.text.length;
	});
	return segments;
}

function textOffsetToPosition(segments, offset, isEnd) {
	for (const {offset: start, length, pos} of segments) {
		if (offset > start && offset <= start + length) return pos + offset - start;
		if (!isEnd && offset === start) return pos;
	}
	return null;
}
