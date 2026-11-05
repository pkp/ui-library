import {expect, test, describe, beforeEach} from 'vitest';
import {useUrl} from './useUrl';

describe('useUrl', () => {
	beforeEach(() => {
		global.pkp = {
			site: {baseUrl: 'http://mock/ojs'},
			context: {
				apiBaseUrl: 'http://mock/ojs/index.php/publicknowledge/api/v1/',
				pageBaseUrl: 'http://mock/ojs/index.php/publicknowledge/',
			},
		};
	});

	test('apiUrl with query params', () => {
		const {apiUrl} = useUrl('submissions/19', {stageId: 3});
		expect(apiUrl.value).toBe(
			'http://mock/ojs/index.php/publicknowledge/api/v1/submissions/19?stageId=3',
		);
	});

	test('pageUrl', () => {
		const {pageUrl} = useUrl('dashboard/editorial');
		expect(pageUrl.value).toBe(
			'http://mock/ojs/index.php/publicknowledge/dashboard/editorial',
		);
	});

	test('assetUrl is based on the site base URL', () => {
		const {assetUrl} = useUrl('js/build/mathjax/tex-svg.js');
		expect(assetUrl.value).toBe('http://mock/ojs/js/build/mathjax/tex-svg.js');
	});

	test('assetUrl accepts root-absolute paths, as emitted by Vite ?url imports', () => {
		const {assetUrl} = useUrl('/js/build/pandoc.wasm');
		expect(assetUrl.value).toBe('http://mock/ojs/js/build/pandoc.wasm');
	});
});
