import {describe, it, expect} from 'vitest';
import {parsePandocAST} from '@sciflow/pandoc-ast';
import ast from './mocks/pandocAstSample.json';
import {
	buildPandocOptions,
	IMPORT_EXTENSIONS,
	fileExtension,
	toMediaBlobs,
	rewriteMediaSrc,
	stripHeader,
	basename,
} from './documentImportUtils.js';

/**
 * `mocks/pandocAstSample.json` was produced with
 *   pandoc -f docx+styles -t json --extract-media=media sample.docx
 * from a DOCX containing a title, two headings, a captioned figure, a
 * captioned table, inline math and a footnote.
 */
const MEDIA_PATH = 'media/media/rId9.png';

function collect(doc, type) {
	const out = [];
	const walk = (n) => {
		if (n?.type === type) out.push(n);
		n?.content?.forEach(walk);
	};
	walk(doc);
	return out;
}

describe('buildPandocOptions', () => {
	it('reads DOCX with the styles extension and extracts media', () => {
		expect(buildPandocOptions('paper.DOCX')).toEqual({
			from: 'docx+styles',
			to: 'json',
			'input-files': ['paper.DOCX'],
			'extract-media': 'media',
		});
	});

	it('rejects extensions outside the supported list', () => {
		expect(IMPORT_EXTENSIONS).toEqual(['docx']);
		expect(fileExtension('a/b.c/Paper.Docx')).toBe('docx');
		expect(fileExtension('README')).toBe('');
		expect(() => buildPandocOptions('paper.pdf')).toThrow(/Unsupported/);
	});
});

describe('toMediaBlobs', () => {
	it('maps the pandoc-wasm mediaFiles object to path/blob entries', () => {
		const png = new Blob(['x'], {type: 'image/png'});
		expect(toMediaBlobs({[MEDIA_PATH]: png})).toEqual([
			{path: MEDIA_PATH, blob: png, mimeType: 'image/png'},
		]);
		expect(toMediaBlobs(undefined)).toEqual([]);
	});
});

describe('basename', () => {
	it('returns the decoded last path segment', () => {
		expect(basename('media/media/image%201.png?x=1#f')).toBe('image 1.png');
		expect(basename('')).toBe('');
	});
});

describe('translator output post-processing', () => {
	it('translates the fixture into a manuscript document with media refs', async () => {
		const media = toMediaBlobs({
			[MEDIA_PATH]: new Blob(['png'], {type: 'image/png'}),
		});
		const result = await parsePandocAST(ast, {media});

		expect(result.doc?.type).toBe('doc');
		expect(result.doc.content[0].type).toBe('header');
		expect(result.errors).toEqual([]);
		expect(result.media).toEqual([
			expect.objectContaining({path: MEDIA_PATH, used: true}),
		]);
		expect(collect(result.doc, 'math').length).toBe(1);
		expect(collect(result.doc, 'table').length).toBe(1);

		const figure = collect(result.doc, 'figure').find((f) =>
			String(f.attrs?.src || '').startsWith('media:'),
		);
		expect(figure.attrs.src).toBe(`media:${MEDIA_PATH}`);
	});

	it('rewrites uploaded media sources and leaves other sources alone', async () => {
		const {doc} = await parsePandocAST(ast, {
			media: toMediaBlobs({[MEDIA_PATH]: new Blob(['png'])}),
		});
		doc.content.push({
			type: 'figure',
			attrs: {src: 'media:media/media/missing.png'},
		});
		doc.content.push({
			type: 'figure',
			attrs: {src: 'https://example.org/keep.png'},
		});

		rewriteMediaSrc(doc, {
			[MEDIA_PATH]: 'https://ojs.test/files/42',
		});

		const sources = collect(doc, 'figure').map((f) => f.attrs.src);
		expect(sources).toContain('https://ojs.test/files/42');
		expect(sources).toContain('media:media/media/missing.png');
		expect(sources).toContain('https://example.org/keep.png');
		expect(sources).not.toContain(`media:${MEDIA_PATH}`);
	});

	it('drops the leading header node only once', async () => {
		const {doc} = await parsePandocAST(ast);
		expect(doc.content[0].type).toBe('header');
		const bodyLength = doc.content.length - 1;

		stripHeader(doc);
		expect(doc.content[0].type).not.toBe('header');
		expect(doc.content.length).toBe(bodyLength);

		stripHeader(doc);
		expect(doc.content.length).toBe(bodyLength);
	});
});
