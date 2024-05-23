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
import {HttpResponse, http, delay} from 'msw';

import {setActivePinia, createPinia} from 'pinia';

import {useFetch} from './useFetch';
import {useModalStore} from '@/stores/modalStore';
global.pkp = global.pkp || {};

export const restHandlers = [
	http.get('http://mock/get/status200', async ({request}) => {
		const url = new URL(request.url);

		let params = new URLSearchParams(url.search);

		// To store the parameters in a simple object
		let allParams = {};
		for (let param of params) {
			allParams[param[0]] = param[1];
		}

		return HttpResponse.json({
			itemsMax: 2,
			items: [{title: 'a'}, {title: 'b'}],
			// to be able assert that it send queryParams correctly
			queryParams: allParams,
		});
	}),

	http.get('http://mock/get/delayed', async ({request}) => {
		const url = new URL(request.url);

		const id = parseInt(url.searchParams.get('id'));
		await delay(id * 200);

		return HttpResponse.json({id});
	}),

	http.get('http://mock/get/status500', async ({request}) => {
		return new HttpResponse(null, {status: 500});
	}),

	http.post('http://mock/post/status200', async ({request}) => {
		const postBody = await request.json();

		return HttpResponse.json(postBody, {status: 200});
	}),

	http.post('http://mock/post/status400', async ({request}) => {
		return HttpResponse.json(
			{
				title: ['has to be longer'],
			},
			{status: 400},
		);
	}),

	http.post('http://mock/post/status500', async ({request}) => {
		return HttpResponse.json({}, {status: 500});
	}),

	http.post('http://mock/put/status200', async ({request}) => {
		const postBody = await request.json();

		const requestHeaders = {};
		request.headers.forEach((value, key) => {
			requestHeaders[key] = value;
		});

		return HttpResponse.json({body: postBody, headers: requestHeaders});
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
		const url = ref('http://mock/get/status200');
		const {data, isLoading, fetch} = useFetch(url, {
			query: {param1: 4, param2: 5},
		});

		expect(isLoading.value).toBe(false);
		const fetchPromise = fetch();
		expect(isLoading.value).toBe(true);

		await fetchPromise;

		expect(isLoading.value).toBe(false);
		expect(data.value).toMatchInlineSnapshot(`
			{
			  "items": [
			    {
			      "title": "a",
			    },
			    {
			      "title": "b",
			    },
			  ],
			  "itemsMax": 2,
			  "queryParams": {
			    "param1": "4",
			    "param2": "5",
			  },
			}
		`);
	});
	test('POST 200 request', async () => {
		const body = {title: 'abc'};
		const url = ref('http://mock/post/status200');
		const {data, isSuccess, validationError, fetch} = useFetch(url, {
			method: 'POST',
			body,
			expectValidationError: true,
		});

		await fetch();

		expect(validationError.value).toBe(null);

		expect(data.value).toStrictEqual(body);
		expect(isSuccess.value).toBe(true);
	});

	test('POST 500 request', async () => {
		const body = {title: 'abc'};
		const url = ref('http://mock/post/status500');
		const {data, fetch, isSuccess} = useFetch(url, {
			method: 'POST',
			body,
		});

		expect(isSuccess.value).toBe(null);

		await fetch();

		expect(isSuccess.value).toBe(false);

		expect(data.value).toStrictEqual(null);
	});

	test('POST 400 validation error request', async () => {
		const url = ref('http://mock/post/status400');
		const {data, validationError, fetch} = useFetch(url, {
			method: 'POST',
			body: {title: 'abc'},
			headers: {'X-Csrf-Token': '___TOKEN___'},
			expectValidationError: true,
		});

		await fetch();

		expect(validationError.value).toStrictEqual({
			title: ['has to be longer'],
		});

		expect(data.value).toBe(null);
	});

	test('PUT 200 request', async () => {
		const url = ref('http://mock/put/status200');
		const {data, validationError, fetch} = useFetch(url, {
			method: 'PUT',
			body: {title: 'abc'},
			expectValidationError: true,
		});

		await fetch();

		expect(validationError.value).toBe(null);
		expect(data.value).toMatchInlineSnapshot(`
			{
			  "body": {
			    "title": "abc",
			  },
			  "headers": {
			    "accept": "application/json",
			    "content-type": "application/json",
			    "x-csrf-token": "test_csrf_token",
			    "x-http-method-override": "PUT",
			  },
			}
		`);
	});
});

describe('features', () => {
	test('last request data is used, previous are aborted', async () => {
		const url = ref('http://mock/get/delayed');
		const query = ref({id: 5});
		const {data, fetch} = useFetch(url, {query});
		const longFetch = fetch();

		query.value.id = 1;
		const shortFetch = fetch();
		await Promise.all([longFetch, shortFetch]);
		expect(data.value).toStrictEqual({id: 1});
	});
	test('network dialog error is displayed if there is http code other than 2XX', async () => {
		const url = ref('http://mock/get/status500');
		const modalStore = useModalStore();
		expect(modalStore.dialogOpened).toBe(false);

		const {fetch} = useFetch(url);
		await fetch();

		expect(modalStore.dialogOpened).toBe(true);
		modalStore.closeDialog();
		expect(modalStore.dialogOpened).toBe(false);
	});
});
