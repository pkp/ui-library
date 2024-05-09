import {
	describe,
	test,
	afterAll,
	afterEach,
	beforeAll,
	beforeEach,
	expect,
} from 'vitest';
import {setupServer} from 'msw/node';
import {ref} from 'vue';
import {HttpResponse, http} from 'msw';

import {setActivePinia, createPinia} from 'pinia';

import {useFetchPaginated} from './useFetchPaginated';

const items = [
	{title: 'a'},
	{title: 'b'},
	{title: 'c'},
	{title: 'd'},
	{title: 'e'},
	{title: 'f'},
	{title: 'g'},
	{title: 'h'},
	{title: 'i'},
	{title: 'j'},
	{title: 'k'},
];

export const restHandlers = [
	http.get('http://mock/get/paginated200', async ({request}) => {
		const url = new URL(request.url);

		let params = new URLSearchParams(url.search);

		const count = parseInt(params.get('count'));
		const offset = parseInt(params.get('offset'));

		const itemsSubset = items.slice(offset, offset + count);
		return HttpResponse.json({
			itemsMax: items.length,
			items: itemsSubset,
		});
	}),

	http.get('http://mock/get/paginated200Laravel', async ({request}) => {
		const url = new URL(request.url);

		let params = new URLSearchParams(url.search);

		const page = parseInt(params.get('page'));
		const perPage = parseInt(params.get('perPage'));

		const offset = (page - 1) * perPage;
		const itemsSubset = items.slice(offset, offset + perPage);
		return HttpResponse.json({
			total: items.length,
			data: itemsSubset,
		});
	}),
];

global.pkp = global.pkp || {};

const server = setupServer(...restHandlers);

// Start server before all tests
beforeAll(() => server.listen({onUnhandledRequest: 'error'}));

//  Close server after all tests
afterAll(() => server.close());

// Reset handlers after each test `important for test isolation`
afterEach(() => server.resetHandlers());

beforeEach(() => {
	setActivePinia(createPinia());
});

describe('typical uses', () => {
	test('GET 200 request', async () => {
		const url = ref('http://mock/get/paginated200');
		const currentPage = ref(1);
		const pageSize = ref(5);
		const {items, pagination, isLoading, fetch} = useFetchPaginated(url, {
			query: {param1: 4, param2: 5},
			currentPage,
			pageSize,
		});

		expect(isLoading.value).toBe(false);
		expect(pagination.value).toMatchInlineSnapshot(`
			{
			  "currentPage": 1,
			  "firstItemIndex": 0,
			  "itemCount": 0,
			  "lastItemIndex": 0,
			  "offset": 0,
			  "pageCount": 0,
			  "pageSize": 5,
			}
		`);
		const fetchPromise = fetch();

		await fetchPromise;
		expect(isLoading.value).toBe(false);
		expect(items.value).toMatchInlineSnapshot(`
			[
			  {
			    "title": "a",
			  },
			  {
			    "title": "b",
			  },
			  {
			    "title": "c",
			  },
			  {
			    "title": "d",
			  },
			  {
			    "title": "e",
			  },
			]
		`);
		expect(pagination.value).toMatchInlineSnapshot(`
			{
			  "currentPage": 1,
			  "firstItemIndex": 1,
			  "itemCount": 11,
			  "lastItemIndex": 5,
			  "offset": 0,
			  "pageCount": 3,
			  "pageSize": 5,
			}
		`);

		currentPage.value = 2;
		pageSize.value = 3;

		await fetch();

		expect(items.value).toMatchInlineSnapshot(`
			[
			  {
			    "title": "d",
			  },
			  {
			    "title": "e",
			  },
			  {
			    "title": "f",
			  },
			]
		`);
		expect(pagination.value).toMatchInlineSnapshot(`
			{
			  "currentPage": 2,
			  "firstItemIndex": 4,
			  "itemCount": 11,
			  "lastItemIndex": 6,
			  "offset": 3,
			  "pageCount": 4,
			  "pageSize": 3,
			}
		`);
	});

	test('GET 200 request using laravel pagination convention', async () => {
		const url = ref('http://mock/get/paginated200Laravel');
		const currentPage = ref(1);
		const pageSize = ref(5);
		const {items, pagination, isLoading, fetch} = useFetchPaginated(url, {
			query: {param1: 4, param2: 5},
			currentPage,
			pageSize,
		});

		expect(isLoading.value).toBe(false);
		expect(pagination.value).toMatchInlineSnapshot(`
			{
			  "currentPage": 1,
			  "firstItemIndex": 0,
			  "itemCount": 0,
			  "lastItemIndex": 0,
			  "offset": 0,
			  "pageCount": 0,
			  "pageSize": 5,
			}
		`);
		const fetchPromise = fetch();

		await fetchPromise;
		expect(isLoading.value).toBe(false);
		expect(items.value).toMatchInlineSnapshot(`
			[
			  {
			    "title": "a",
			  },
			  {
			    "title": "b",
			  },
			  {
			    "title": "c",
			  },
			  {
			    "title": "d",
			  },
			  {
			    "title": "e",
			  },
			]
		`);
		expect(pagination.value).toMatchInlineSnapshot(`
			{
			  "currentPage": 1,
			  "firstItemIndex": 1,
			  "itemCount": 11,
			  "lastItemIndex": 5,
			  "offset": 0,
			  "pageCount": 3,
			  "pageSize": 5,
			}
		`);

		currentPage.value = 2;
		pageSize.value = 3;

		await fetch();

		expect(items.value).toMatchInlineSnapshot(`
			[
			  {
			    "title": "d",
			  },
			  {
			    "title": "e",
			  },
			  {
			    "title": "f",
			  },
			]
		`);
		expect(pagination.value).toMatchInlineSnapshot(`
			{
			  "currentPage": 2,
			  "firstItemIndex": 4,
			  "itemCount": 11,
			  "lastItemIndex": 6,
			  "offset": 3,
			  "pageCount": 4,
			  "pageSize": 3,
			}
		`);
	});
});
