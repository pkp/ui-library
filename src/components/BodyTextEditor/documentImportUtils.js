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
