/**
 * pandoc-wasm is imported in an unusual way here on purpose.
 *
 * 1. We can't use the official entry (`import {convert} from 'pandoc-wasm'`):
 *    it resolves to src/index.browser.js, which uses top-level await. This
 *    project bundles as IIFE, and top-level await isn't supported in the iife
 *    output format — the build fails outright.
 *
 * 2. We can't use a bare subpath (`'pandoc-wasm/src/core.js'`) either: the
 *    package's "exports" map only exposes ".", so the bundler rejects the
 *    subpath as "not exported".
 *
 * So we reach the package's internal core.js via a direct relative
 * node_modules path. core.js exposes `createPandocInstance` (a plain factory,
 * no top-level await), and we fetch the .wasm ourselves via Vite's `?url`.
 * This also loads the ~58 MB binary lazily — only when an import actually runs,
 * not on every page load (which the official entry would do).
 *
 * Caveat: core.js is an internal module, not part of pandoc-wasm's public API,
 * so re-verify these imports when upgrading the dependency.
 */
import {createPandocInstance} from '../../../node_modules/pandoc-wasm/src/core.js';
import pandocWasmUrl from '../../../node_modules/pandoc-wasm/src/pandoc.wasm?url';

let pandocPromise = null;

export function loadPandoc() {
	if (pandocPromise) return pandocPromise;
	pandocPromise = fetch(pandocWasmUrl)
		.then((r) => r.arrayBuffer())
		.then((buf) => createPandocInstance(buf))
		.catch((err) => {
			pandocPromise = null;
			throw err;
		});
	return pandocPromise;
}
