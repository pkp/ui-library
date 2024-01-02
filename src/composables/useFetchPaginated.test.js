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

		console.log('params:', count, offset, offset + count);
		const itemsSubset = items.slice(offset, offset + count);
		console.log('itesmsubset:', itemsSubset);
		return HttpResponse.json({
			itemsMax: items.length,
			items: itemsSubset,
		});
	}),
];

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
		const page = ref(1);
		const pageSize = ref(5);
		const {items, pagination, isLoading, fetch} = useFetchPaginated(url, {
			query: {param1: 4, param2: 5},
			page,
			pageSize,
		});

		expect(isLoading.value).toBe(false);
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
			  "firstItemIndex": 1,
			  "itemCount": 11,
			  "lastItemIndex": 5,
			  "offset": 0,
			  "page": 1,
			  "pageCount": 3,
			  "pageSize": 5,
			}
		`);

		page.value = 2;
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
			  "firstItemIndex": 4,
			  "itemCount": 11,
			  "lastItemIndex": 6,
			  "offset": 3,
			  "page": 2,
			  "pageCount": 4,
			  "pageSize": 3,
			}
		`);
	});
});
