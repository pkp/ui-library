export {
	getCitedReferenceIds,
	validateDocumentResources,
} from '@sciflow/editor-start/bundle';

/**
 * Dynamically inject the self-hosted MathJax 4 tex-svg script tag if not already present.
 * The bundle is pinned via the `mathjax` npm package and copied to js/build/mathjax at build time.
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
		script.src = `${pkp.site.baseUrl}/js/build/mathjax/tex-svg.js`;
		script.dataset.mathjax4 = '';
		script.async = true;
		script.onload = resolve;
		script.onerror = reject;
		document.head.appendChild(script);
	});
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
			rawReference: rawCitation || c?.title || id,
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
