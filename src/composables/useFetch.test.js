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
import {useDialogStore} from '@/stores/dialogStore';

export const restHandlers = [
	http.get('http://mock/delayed', async ({request}) => {
		const url = new URL(request.url);

		const id = parseInt(url.searchParams.get('id'));
		await delay(id * 200);

		return HttpResponse.json({id});
	}),

	http.get('http://mock/status500', async ({request}) => {
		return new HttpResponse(null, {status: 500});
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

describe('useFetch', () => {
	test('last request data is used, previous are aborted', async () => {
		const url = ref('http://mock/delayed?id=5');
		const {data, fetch} = useFetch(url);
		const longFetch = fetch();

		url.value = 'http://mock/delayed?id=1';
		const shortFetch = fetch();
		await Promise.all([longFetch, shortFetch]);
		expect(data.value).toStrictEqual({id: 1});
	});

	test('network dialog error is displayed if there is http code other than 2XX', async () => {
		const url = ref('http://mock/status500');
		const dialogStore = useDialogStore();
		expect(dialogStore.dialogOpened).toBe(false);

		const {fetch} = useFetch(url);
		await fetch();

		expect(dialogStore.dialogOpened).toBe(true);
		dialogStore.closeDialog();
		expect(dialogStore.dialogOpened).toBe(false);
	});
});
