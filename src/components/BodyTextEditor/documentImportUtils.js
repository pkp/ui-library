/**
 * Pure helpers for the document import pipeline. Apart from
 * `buildPandocOptions` and `toMediaBlobs`, everything here operates on the
 * ProseMirror JSON returned by `parsePandocAST`, never on the Pandoc AST.
 * Nothing here touches WASM, the DOM or the network, so it can be unit-tested
 * directly.
 */

import {SfNodeType} from '@sciflow/pandoc-ast';

const MEDIA_SRC_PREFIX = 'media:';

/**
 * Inline SVG shown in place of an image that could not be uploaded. Mirrors
 * the crossed-out box the translator itself uses for images pandoc did not
 * extract, so both failure modes look the same in the editor.
 */
export const MISSING_IMAGE_SRC =
	'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10"><line x1="0" y1="0" x2="10" y2="10" stroke="grey" stroke-width="5"/><line x1="10" y1="0" x2="0" y2="10" stroke="red" stroke-width="5"/></svg>';

/**
 * Pandoc readers per supported file extension. This single map drives both
 * the "Send to Text Editor" gate in the file manager and the converter, so
 * the two cannot drift apart.
 *
 * Scoped to DOCX for now. The `+styles` extension keeps Word style names as
 * Div/Span classes, which the AST translator uses for figure/caption
 * detection. Pandoc also reads the formats below; enable them here once the
 * import has been validated with them.
 */
export const IMPORT_READERS = {
	docx: 'docx+styles',
	// odt: 'odt',
	// rtf: 'rtf',
	// tex: 'latex',
	// latex: 'latex',
	// md: 'markdown',
	// markdown: 'markdown',
};

export const IMPORT_EXTENSIONS = Object.keys(IMPORT_READERS);

/**
 * Lower-cased extension of `fileName` without the dot, or '' when none.
 */
export function fileExtension(fileName) {
	const match = /\.([^./\\]+)$/.exec(String(fileName || ''));
	return match ? match[1].toLowerCase() : '';
}

/**
 * Build the pandoc-wasm options for converting `fileName` to a JSON AST.
 * Throws for extensions that are not in `IMPORT_READERS`.
 */
export function buildPandocOptions(fileName) {
	const reader = IMPORT_READERS[fileExtension(fileName)];
	if (!reader) {
		throw new Error(`Unsupported import format: ${fileName}`);
	}
	return {
		from: reader,
		to: 'json',
		'input-files': [fileName],
		'extract-media': 'media',
	};
}

/**
 * Turn pandoc-wasm's `mediaFiles` map ({path: Blob}) into the `media` array
 * expected by `parsePandocAST`. The translator matches image nodes by `path`
 * only; it never reads the blob bytes.
 */
export function toMediaBlobs(mediaFiles) {
	return Object.entries(mediaFiles || {}).map(([path, blob]) => ({
		path,
		blob,
		mimeType: blob?.type || undefined,
	}));
}

/**
 * `items.map(fn)` for async `fn`, running at most `limit` calls at a time.
 * Results keep the order of `items`; `fn` is expected not to reject.
 */
export async function mapWithConcurrency(items, limit, fn) {
	const results = new Array(items.length);
	let next = 0;
	async function worker() {
		while (next < items.length) {
			const index = next++;
			results[index] = await fn(items[index], index);
		}
	}
	await Promise.all(
		Array.from({length: Math.min(limit, items.length)}, worker),
	);
	return results;
}

/**
 * Depth-first walk over a ProseMirror JSON node tree.
 */
function walkNodes(node, visit) {
	if (!node || typeof node !== 'object') return;
	visit(node);
	if (Array.isArray(node.content)) {
		node.content.forEach((child) => walkNodes(child, visit));
	}
}

/**
 * Replace every `attrs.src` of the form `media:<path>` (as written by the
 * translator) with the URL the file was uploaded to. `urlByPath` maps the
 * media path, as reported by pandoc-wasm and `parsePandocAST().media`, to
 * the URL. Nodes whose media was not uploaded are left untouched.
 * Mutates and returns `doc`.
 */
export function rewriteMediaSrc(doc, urlByPath) {
	walkNodes(doc, (node) => {
		const src = node.attrs?.src;
		if (typeof src !== 'string' || !src.startsWith(MEDIA_SRC_PREFIX)) return;
		const url = urlByPath?.[src.slice(MEDIA_SRC_PREFIX.length)];
		if (url) {
			node.attrs.src = url;
		}
	});
	return doc;
}

/**
 * Drop the leading `header` node (title/subtitle) the translator builds from
 * the document metadata. OJS keeps the title as publication metadata, so the
 * body text should start with the first body block.
 * Mutates and returns `doc`.
 */
export function stripHeader(doc) {
	if (
		Array.isArray(doc?.content) &&
		doc.content[0]?.type === SfNodeType.header
	) {
		doc.content.shift();
	}
	return doc;
}

/**
 * Last path segment, without query string or fragment, URL-decoded.
 */
export function basename(path) {
	const clean = String(path || '')
		.split(/[?#]/)[0]
		.replace(/\/+$/, '');
	const parts = clean.split('/');
	try {
		return decodeURIComponent(parts[parts.length - 1] || '');
	} catch {
		return parts[parts.length - 1] || '';
	}
}
