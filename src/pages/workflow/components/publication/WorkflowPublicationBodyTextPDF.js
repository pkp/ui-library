import DOMPurify from 'dompurify';
import {bodyTextMathStyles} from '@/components/BodyTextEditor/useBodyTextEditor.js';
import {bodyTextReferenceStyles} from '@/components/BodyTextEditor/bodyTextReferenceExport.js';

const textColor = '#475569';

const printStyles = `
	@page { size: A4; margin: 20mm; @bottom-center { content: counter(page); } }
	body { font-family: Arial, Helvetica, sans-serif; font-size: 10pt; line-height: 1.6; color: ${textColor}; }
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
	${bodyTextReferenceStyles}
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

/** Remove unsafe HTML and convert relative image URLs to absolute URLs for the PDF preview. */
export function preparePDFHTML(html, baseUrl, {mathAsImages = false} = {}) {
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
	if (mathAsImages) convertMathSVGToImages(container);
	return container.innerHTML;
}

/** Convert equations from inline SVGs to images so they appear in the exported PDF. */
function convertMathSVGToImages(container) {
	container.querySelectorAll('.body-text-math > svg').forEach((svg) => {
		const image = document.createElement('img');
		image.alt =
			svg.parentElement.getAttribute('aria-label') ||
			svg.getAttribute('aria-label') ||
			'';
		// Keep MathJax's font-relative width and baseline; the viewBox keeps the aspect ratio.
		const width = svg.getAttribute('width');
		if (/^(?:\d+\.?\d*|\.\d+)ex$/.test(width)) {
			image.style.width = width;
		}
		image.style.maxWidth = '100%';
		image.style.verticalAlign = svg.style.verticalAlign;
		image.style.display = 'inline-block';
		// An external SVG cannot inherit the article's currentColor.
		svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
		svg.setAttribute('color', textColor);
		// Use the viewBox for intrinsic sizing, not the image document's font.
		svg.removeAttribute('width');
		svg.removeAttribute('height');
		svg.removeAttribute('style');
		// XML serialization keeps namespaced attributes valid in the standalone SVG.
		const markup = new XMLSerializer().serializeToString(svg);
		image.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(markup)}`;
		svg.replaceWith(image);
	});
}

export function createPDFPreviewDocument(html, {baseUrl, title}) {
	const container = document.createElement('div');
	container.innerHTML = preparePDFHTML(html, baseUrl);
	// Open article links separately, but keep in-page navigation in the preview.
	container.querySelectorAll('a[href]').forEach((link) => {
		if (link.getAttribute('href').startsWith('#')) {
			link.removeAttribute('target');
		} else {
			link.target = '_blank';
			link.rel = 'noopener noreferrer';
		}
	});
	return `<!doctype html><html><head><meta charset="utf-8">
		<meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src http: https: data: blob:; style-src 'unsafe-inline';">
		<title>${escapeHTML(title)}</title>
		<style>${printStyles}
			* { box-sizing: border-box; }
			html, body { margin: 0; height: 100%; }
			body { background: #f8f9fa; }
			.preview-canvas { padding: 16px 24px 32px; container-type: inline-size; }
			/* A4 proportions; the type and padding scale with the paper width. */
			.preview-paper { width: min(100%, 210mm); aspect-ratio: 210 / 297; margin: 0 auto; padding: 4.7em 5.7em; background: #fff; box-shadow: 0 2px 4px rgb(0 0 0 / 20%); overflow-wrap: anywhere; font-size: min(12pt, 2cqw); }
			.preview-paper h1 { font-size: 1.4em; }
			.preview-paper h2 { font-size: 1.2em; }
			.preview-paper h3 { font-size: 1.1em; }
			.preview-paper h4, .preview-paper h5, .preview-paper h6 { font-size: 1em; }
			@media (max-width: 600px) {
				.preview-canvas { padding: 16px 12px; }
				.preview-paper { aspect-ratio: auto; padding: 2em 1.5em; font-size: 12pt; }
			}
		</style></head><body>
		<main class="preview-canvas">
			<article class="preview-paper">${container.innerHTML}</article>
		</main>
		</body></html>`;
}

export async function generatePDF(html, {baseUrl, assetBaseUrl}) {
	const {vivliostylePdfEngine, emitPdfFromVivliostyleWindow} = await import(
		'vivliostyle-pdf'
	);
	const sourceHtml = `<!doctype html><html><head><meta charset="utf-8">
		<style>${printStyles}</style></head><body>${preparePDFHTML(html, baseUrl, {mathAsImages: true})}</body></html>`;
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
