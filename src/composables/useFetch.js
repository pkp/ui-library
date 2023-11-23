import {ref, unref} from 'vue';
import {ofetch} from 'ofetch';
import {useDialogStore} from '@/stores/dialogStore';
export function useFetch(url, options) {
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

		const opts = options;

		isLoading.value = true;
		try {
			const result = await ofetch(unref(url), opts);
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
