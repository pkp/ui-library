/**
 * Document import pipeline for the body-text editor:
 * download → pandoc-wasm (JSON AST) → `@sciflow/pandoc-ast` (ProseMirror JSON)
 * → upload extracted images → rewrite image sources → strip the title header.
 *
 * Pure logic, no UI: progress is reported through `stage`, failures are
 * thrown as plain `Error`s whose message is meant to be shown to the user,
 * and translator warnings come back with the document.
 */
import {ref} from 'vue';
import {parsePandocAST} from '@sciflow/pandoc-ast';
import {createPandocInstance} from 'pandoc-core/core.js';
import pandocWasmUrl from 'pandoc-core/pandoc.wasm?url';
import {useLocalize} from '@/composables/useLocalize';
import {
	buildPandocOptions,
	toMediaBlobs,
	rewriteMediaSrc,
	stripHeader,
	basename,
	mapWithConcurrency,
	MISSING_IMAGE_SRC,
} from './documentImportUtils.js';

/** How many extracted images are uploaded at the same time. */
const UPLOAD_CONCURRENCY = 3;

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
let pandocPromise = null;

function loadPandoc() {
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

/**
 * @param {object} options
 * @param {(file: File) => Promise<{id?: number, url?: string, error?: string}>} options.uploadFile
 *   Uploads one extracted image and resolves to its id and URL, or to an
 *   error message when it could not be uploaded.
 */
export function useDocumentImport({uploadFile}) {
	const {t} = useLocalize();

	/** 'download' | 'load' | 'convert' | 'upload' while running, null when idle. */
	const stage = ref(null);

	/**
	 * Import the document at `url`. `fileName` must keep the original
	 * extension so pandoc can pick the reader.
	 *
	 * Resolves to `{doc, uploadedFiles, warnings}`: the ProseMirror JSON,
	 * the uploaded `{id, url, mimeType}` entries for the editor's file
	 * registry, and human-readable warnings for blocks the translator could
	 * not convert or images pandoc could not extract.
	 */
	async function importDocument({url, fileName}) {
		try {
			stage.value = 'download';
			const response = await fetch(url);
			if (!response.ok) {
				throw new Error(`Download failed: HTTP ${response.status}`);
			}
			const file = new File([await response.blob()], fileName);

			if (!pandocPromise) stage.value = 'load';
			const pandoc = await loadPandoc();

			stage.value = 'convert';
			const result = await pandoc.convert(buildPandocOptions(fileName), null, {
				[fileName]: file,
			});
			if (result.stderr) {
				console.warn('[documentImport] pandoc:', result.stderr);
			}
			if (!result.stdout?.trim()) {
				throw new Error(
					result.stderr?.trim() || t('publication.bodyText.import.failed'),
				);
			}
			const media = toMediaBlobs(result.mediaFiles);
			const parsed = await parsePandocAST(JSON.parse(result.stdout), {media});
			if (!parsed.doc) {
				throw new Error(
					parsed.errors?.at(-1)?.message ||
						t('publication.bodyText.import.failed'),
				);
			}

			stage.value = 'upload';
			const {urlByPath, uploadedFiles, missingImages, failedUploads} =
				await uploadUsedMedia(parsed.media, media);

			const doc = stripHeader(rewriteMediaSrc(parsed.doc, urlByPath));

			const errors = Array.isArray(parsed.errors) ? parsed.errors : [];
			const warnings = [
				...errors.map((error) => error?.message || String(error)),
				...missingImages.map((path) =>
					t('publication.bodyText.import.missingImage', {path}),
				),
				...failedUploads.map(({path, error}) =>
					t('publication.bodyText.import.uploadFailed', {path, error}),
				),
			];
			if (warnings.length > 0) {
				console.warn('[documentImport] warnings:', {
					errors,
					missingImages,
					failedUploads,
				});
			}

			return {doc, uploadedFiles, warnings};
		} finally {
			stage.value = null;
		}
	}

	/**
	 * Upload every media file the parsed document actually references, a few
	 * at a time. Nothing here aborts the import: an image that fails to
	 * upload is reported in `failedUploads` and its node is pointed at a
	 * placeholder through `urlByPath`, alongside the real URLs of the
	 * successful uploads. `missingImages` lists referenced images pandoc did
	 * not extract (linked or external pictures), which the translator has
	 * already replaced with a placeholder.
	 */
	async function uploadUsedMedia(manifest, mediaBlobs) {
		const blobByPath = new Map(mediaBlobs.map((m) => [m.path, m.blob]));
		const used = (manifest || []).filter((entry) => entry.used);
		const missingImages = used
			.filter((entry) => !blobByPath.has(entry.path))
			.map((entry) => entry.path);

		const results = await mapWithConcurrency(
			used.filter((entry) => blobByPath.has(entry.path)),
			UPLOAD_CONCURRENCY,
			async (entry, index) => {
				const blob = blobByPath.get(entry.path);
				const name = basename(entry.path) || `image-${index + 1}`;
				const file = new File([blob], name, {type: blob.type || undefined});
				const {id, url, error} = await uploadFile(file);
				return {
					path: entry.path,
					id,
					url,
					error,
					mimeType: blob.type || undefined,
				};
			},
		);
		const uploaded = results.filter((r) => r.id);
		const failed = results.filter((r) => !r.id);

		return {
			urlByPath: Object.fromEntries([
				...uploaded.map(({path, url}) => [path, url]),
				...failed.map(({path}) => [path, MISSING_IMAGE_SRC]),
			]),
			uploadedFiles: uploaded.map(({id, url, mimeType}) => ({
				id,
				url,
				mimeType,
			})),
			missingImages,
			failedUploads: failed.map(({path, error}) => ({path, error})),
		};
	}

	return {stage, importDocument};
}
