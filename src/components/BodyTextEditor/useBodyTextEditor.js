import {DOMSerializer} from 'prosemirror-model';

/**
 * Editor-side helpers for the body-text editor: MathJax bootstrap, OJS
 * citations → SciFlow references, and document serialisation for
 * dirty-state comparison.
 */
export function useBodyTextEditor() {
	return {loadMathJax, transformCitationsForEditor, serializeDocument};
}

/** Serialize the live document using its configured schema, not the editor UI DOM. */
export async function editorDocumentToHTML(doc) {
	if (!doc) return '';
	const container = document.createElement('div');
	container.appendChild(
		DOMSerializer.fromSchema(doc.type.schema).serializeFragment(doc.content, {
			document,
		}),
	);
	// Render any MathJax equations in the serialized HTML.
	const equations = container.querySelectorAll('math[data-tex]');
	if (equations.length) {
		await loadMathJax();
		for (const equation of equations) {
			const tex = equation.getAttribute('data-tex') || '';
			const display = equation.getAttribute('data-style') === 'display';
			const rendered = await window.MathJax.tex2svgPromise(
				tex.trim() || '\\phantom{x}',
				{display},
			);
			const svg = rendered.querySelector('svg')?.cloneNode(true);
			if (!svg) throw new Error('MathJax did not render an equation.');
			// MathJax renders invalid TeX as an error node instead of rejecting.
			const renderError = svg
				.querySelector('[data-mjx-error]')
				?.getAttribute('data-mjx-error');
			if (renderError) {
				throw new Error(`Invalid equation "${tex}": ${renderError}`);
			}
			const wrapper = document.createElement('span');
			wrapper.className = display
				? 'body-text-math body-text-math--display'
				: 'body-text-math';
			wrapper.setAttribute('role', 'math');
			wrapper.setAttribute('aria-label', tex);
			// Sanitization removes inline styles; retain only this numeric metric.
			if (svg.style.verticalAlign) {
				svg.setAttribute('data-math-baseline', svg.style.verticalAlign);
			}
			wrapper.appendChild(svg);
			equation.replaceWith(wrapper);
		}
	}
	return container.innerHTML;
}

export const bodyTextMathStyles = `
	.body-text-math { display: inline; }
	.body-text-math > svg { display: inline-block; overflow: visible; max-width: 100%; }
	.body-text-math--display { display: block; margin: 1em 0; text-align: center; }
`;

/**
 * Dynamically inject the self-hosted MathJax 4 tex-svg script tag if not already present.
 * The bundle is pinned via the `mathjax` npm package and copied to js/build/mathjax at build time.
 * The SciFlow math feature checks for window.MathJax.tex2svgPromise at render time.
 */
let mathJaxPromise = null;

function loadMathJax() {
	mathJaxPromise ??= loadMathJaxOnce().catch((error) => {
		mathJaxPromise = null;
		throw error;
	});
	return mathJaxPromise;
}

async function loadMathJaxOnce() {
	if (!window.MathJax?.tex2svgPromise) {
		await loadMathJaxScript();
	}
	await window.MathJax?.startup?.promise;
	if (!window.MathJax?.tex2svgPromise) {
		throw new Error('MathJax is unavailable.');
	}
	// Export standalone SVGs, including when MathJax was loaded earlier.
	const outputOptions = window.MathJax.startup?.document?.outputJax?.options;
	if (outputOptions) {
		outputOptions.fontCache = 'none';

		// MathJax 4 splits inline equations into multiple SVGs.
		// The converter transforms one SVG per equation, so disable splitting to
		// avoid truncating formulas (e.g. exporting only x² from x² + y³ = √16).
		outputOptions.linebreaks.inline = false;
	}
}

function loadMathJaxScript() {
	const existing = document.querySelector('script[data-mathjax4]');
	// The load event may already have fired; startup is awaited by the caller.
	if (existing?.dataset.loaded) return Promise.resolve();
	if (existing) {
		return new Promise((resolve, reject) => {
			existing.addEventListener('load', resolve, {once: true});
			existing.addEventListener('error', reject, {once: true});
		});
	}
	window.MathJax = {
		...window.MathJax,
		svg: {
			...window.MathJax?.svg,
			fontCache: 'none',
			linebreaks: {...window.MathJax?.svg?.linebreaks, inline: false},
		},
	};
	return new Promise((resolve, reject) => {
		const script = document.createElement('script');
		script.src = `${pkp.site.baseUrl}/js/build/mathjax/tex-svg.js`;
		script.dataset.mathjax4 = '';
		script.async = true;
		script.onload = () => {
			script.dataset.loaded = 'true';
			resolve();
		};
		script.onerror = () => {
			script.remove();
			reject(new Error('Unable to load MathJax.'));
		};
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
