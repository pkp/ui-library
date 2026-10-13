import DOMPurify from 'dompurify';
import {bodyTextMathStyles} from '@/components/BodyTextEditor/useBodyTextEditor.js';

const printStyles = `
	@page { size: A4; margin: 20mm; @bottom-center { content: counter(page); } }
	body { font-family: Arial, Helvetica, sans-serif; font-size: 10pt; line-height: 1.6; color: #475569; }
	h1, h2, h3, h4, h5, h6 { break-after: avoid; line-height: 1.2; }
	h1 { margin: 0 0 1em; font-size: 14pt; text-align: center; color: #0f172a; }
	h2, h3, h4, h5, h6 { margin: 1.8em 0 0.8em; font-size: 11pt; color: #1e293b; }
	p { orphans: 3; widows: 3; }
	img, svg { max-width: 100%; height: auto; }
	figure { margin: 1em 0; break-inside: avoid; }
	table { width: 100%; border-collapse: collapse; }
	th, td { border: 1px solid #888; padding: 0.4em; }
	pre { white-space: pre-wrap; }
	${bodyTextMathStyles}
`;

function escapeHTML(value) {
	return String(value).replace(
		/[&<>"']/g,
		(character) =>
			({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'})[
				character
			],
	);
}

/** Keep editor content inert and resolve images before Vivliostyle loads a blob URL. */
export function preparePDFHTML(html, baseUrl) {
	const safeHTML = DOMPurify.sanitize(html, {
		USE_PROFILES: {html: true, svg: true, mathMl: true},
		FORBID_TAGS: [
			'style',
			'iframe',
			'object',
			'embed',
			'form',
			'input',
			'button',
		],
		FORBID_ATTR: ['style', 'srcset'],
	});
	const container = document.createElement('div');
	container.innerHTML = safeHTML;
	container
		.querySelectorAll('.body-text-math > svg[data-math-baseline]')
		.forEach((svg) => {
			const baseline = svg.getAttribute('data-math-baseline');
			if (/^-?(?:\d+\.?\d*|\.\d+)ex$/.test(baseline)) {
				svg.style.verticalAlign = baseline;
			}
		});
	container.querySelectorAll('[src], [href]').forEach((element) => {
		for (const attribute of ['src', 'href']) {
			const value = element.getAttribute(attribute);
			if (!value || value.startsWith('#') || value.startsWith('data:'))
				continue;
			const url = new URL(value, baseUrl);
			if (['http:', 'https:', 'blob:'].includes(url.protocol)) {
				element.setAttribute(attribute, url.href);
			} else {
				element.removeAttribute(attribute);
			}
		}
	});
	return container.innerHTML;
}

export function createPDFPreviewDocument(
	html,
	{
		baseUrl,
		title,
		generateLabel,
		publicationLabel = 'Publication:',
		previewLabel = 'Preview: PDF',
		editLabel = 'Edit',
	},
) {
	return `<!doctype html><html><head><meta charset="utf-8">
		<meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src http: https: data: blob:; style-src 'unsafe-inline'; frame-src blob:;">
		<title>${escapeHTML(title)}</title>
		<style>${printStyles}
			* { box-sizing: border-box; }
			html, body { margin: 0; height: 100%; }
			body { display: flex; flex-direction: column; background: #f8f9fa; }
			.preview-header { flex: none; padding: 24px 28px; border-bottom: 1px solid #bfc3c5; background: #fff; color: #00384f; font-size: 14px; line-height: 1.5; }
			.preview-header { display: flex; align-items: center; gap: 16px; }
			.preview-header h2 { margin: 0; font-size: inherit; font-weight: 400; color: inherit; text-transform: uppercase; }
			.preview-canvas { flex: 1; min-height: 0; overflow: auto; padding: 16px 24px 32px; }
			.preview-paper { width: 100%; max-width: 210mm; min-height: 297mm; margin: 0 auto; padding: 20mm 24mm; background: #fff; box-shadow: 0 2px 4px rgb(0 0 0 / 20%); overflow-wrap: anywhere; }
			.toolbar { display: flex; flex: none; align-items: center; justify-content: flex-end; gap: 16px; padding: 12px 24px; border-top: 1px solid #e5e7eb; background: #fff; font-size: 14px; }
			#pdf-status { margin-right: auto; }
			button { border: 1px solid #0075a3; border-radius: 3px; padding: 8px 12px; background: #0075a3; color: #fff; font: 600 14px/1.5 Arial, Helvetica, sans-serif; cursor: pointer; }
			button:hover:not(:disabled) { background: #005a7d; }
			button:focus-visible { outline: 2px solid #00384f; outline-offset: 3px; }
			button:disabled { opacity: 0.6; cursor: wait; }
			#back-to-editor { display: inline-flex; align-items: center; justify-content: center; flex: none; border: 0; padding: 4px; background: transparent; color: #0075a3; }
			#back-to-editor:hover { background: #f1f5f9; }
			#back-to-editor svg { width: 20px; height: 20px; }
			#pdf-viewer { display: block; width: 100%; height: 100%; min-height: 500px; border: 0; }
			@media (max-width: 600px) {
				.preview-header { padding: 16px; }
				.preview-canvas { padding: 16px 12px; }
				.preview-paper { min-height: 0; padding: 32px 24px; }
				.toolbar { padding: 12px 16px; flex-wrap: wrap; }
			}
			[hidden] { display: none !important; }
		</style></head><body>
		<header class="preview-header">
			<button id="back-to-editor" type="button" aria-label="${escapeHTML(editLabel)}" title="${escapeHTML(editLabel)}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="m14 6-6 6 6 6" /></svg></button>
			<h2><strong>${escapeHTML(publicationLabel)}</strong> ${escapeHTML(previewLabel)}</h2>
		</header>
		<main class="preview-canvas">
			<article id="html-preview" class="preview-paper">${preparePDFHTML(html, baseUrl)}</article>
			<iframe id="pdf-viewer" title="${escapeHTML(title)}" hidden></iframe>
		</main>
		<footer class="toolbar">
			<span id="pdf-status" role="status" aria-live="polite"></span>
			<button id="generate-pdf" type="button">${escapeHTML(generateLabel)}</button>
		</footer>
		</body></html>`;
}

export async function generatePDF(html, {baseUrl, assetBaseUrl}) {
	const {vivliostylePdfEngine, emitPdfFromVivliostyleWindow} = await import(
		'vivliostyle-pdf'
	);
	const sourceHtml = `<!doctype html><html><head><meta charset="utf-8">
		<style>${printStyles}</style></head><body>${preparePDFHTML(html, baseUrl)}</body></html>`;
	const pagination = await vivliostylePdfEngine.preparePagination({
		html: sourceHtml,
	});
	try {
		return await emitPdfFromVivliostyleWindow(pagination.win, {
			sourceHtml,
			baseUrl: assetBaseUrl,
		});
	} finally {
		pagination.cleanup();
	}
}
