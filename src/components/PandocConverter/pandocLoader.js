/**
 * Bypasses pandoc-wasm's browser entry (which uses top-level await and is
 * incompatible with the iife output format) by loading core.js directly and
 * fetching the .wasm binary as an asset URL at runtime.
 */
import {createPandocInstance} from '../../../node_modules/pandoc-wasm/src/core.js';
import pandocWasmUrl from '../../../node_modules/pandoc-wasm/src/pandoc.wasm?url';

let pandocPromise = null;

export function loadPandoc() {
	if (pandocPromise) return pandocPromise;
	pandocPromise = fetch(pandocWasmUrl)
		.then((r) => r.arrayBuffer())
		.then((buf) => createPandocInstance(buf));
	return pandocPromise;
}
