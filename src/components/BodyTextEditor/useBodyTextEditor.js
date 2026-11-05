import {useUrl} from '@/composables/useUrl';

/**
 * Editor-side helpers for the body-text editor: MathJax bootstrap, OJS
 * citations → SciFlow references, and document serialisation for
 * dirty-state comparison.
 */
export function useBodyTextEditor() {
	return {loadMathJax, transformCitationsForEditor, serializeDocument};
}

/**
 * Dynamically inject the self-hosted MathJax 4 tex-svg script tag if not already present.
 * The bundle is pinned via the `mathjax` npm package and copied to js/build/mathjax at build time.
 * The SciFlow math feature checks for window.MathJax.tex2svgPromise at render time.
 *
 * Glyphs outside the font data embedded in tex-svg.js (e.g. \mathbb, \mathcal,
 * \mathfrak) are loaded on demand from `[fonts]/mathjax-newcm-font/svg/dynamic/`.
 * MathJax defaults `[fonts]` to cdn.jsdelivr.net, so it is pointed at the copy
 * in js/build/mathjax-fonts, which is copied there at build time as well.
 */
function loadMathJax() {
	if (window.MathJax?.tex2svgPromise) return Promise.resolve();
	const existing = document.querySelector('script[data-mathjax4]');
	if (existing) {
		return new Promise((resolve) =>
			existing.addEventListener('load', resolve, {once: true}),
		);
	}
	const {assetUrl: scriptUrl} = useUrl('js/build/mathjax/tex-svg.js');
	const {assetUrl: fontsUrl} = useUrl('js/build/mathjax-fonts');
	window.MathJax = {loader: {paths: {fonts: fontsUrl.value}}};
	return new Promise((resolve, reject) => {
		const script = document.createElement('script');
		script.src = scriptUrl.value;
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
function transformCitationsForEditor(citations) {
	return (citations || []).map((c) => {
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
}

/**
 * Stable JSON serialization of a document for dirty-state comparison.
 */
function serializeDocument(doc) {
	if (!doc || typeof doc !== 'object') return '';
	try {
		return JSON.stringify(doc);
	} catch {
		return '';
	}
}
