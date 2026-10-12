/**
 * Import formats supported by the Body Text importer. Kept free of any
 * imports on purpose: the shared file manager reads `IMPORT_EXTENSIONS` to
 * decide whether to offer "Send to Text Editor", and importing anything
 * heavier here would pull the OJS-only editor dependencies into the OMP and
 * OPS bundles.
 */

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
