import {ref, unref} from 'vue';
import {ofetch, createFetch} from 'ofetch';
import {useDialogStore} from '@/stores/dialogStore';

let ofetchInstance = ofetch;
export function useFetch(url, options) {
	/**
	 *  Workaround for testing https://github.com/unjs/ofetch/issues/295
	 *  Can be removed once issue is addressed
	 *  (likely getting fetch instance in runtime)
	 * */
	if (typeof process !== 'undefined' && process?.env?.VITEST == 'true') {
		ofetchInstance = createFetch();
	}

	const dialogStore = useDialogStore();
	const isLoading = ref(false);
	const data = ref(null);

	let lastRequestController = null;

	async function fetch() {
		if (lastRequestController) {
			// abort in-flight request
			lastRequestController.abort();
		}
		lastRequestController = new AbortController();

		const signal = lastRequestController.signal;

		const opts = {...options, signal};

		isLoading.value = true;
		try {
			const result = await ofetchInstance(unref(url), opts);
			data.value = result;
		} catch (e) {
			data.value = null;

			if (signal) {
				e.aborted = signal.aborted;
			}
			if (e.aborted) {
				return; // aborted by subsequent request
			}

			dialogStore.openDialogNetworkError(e);
		} finally {
			lastRequestController = null;
			isLoading.value = false;
		}
	}

	return {
		data,
		isLoading,
		fetch,
	};
}
