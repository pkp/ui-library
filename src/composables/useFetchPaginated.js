import {ref, computed} from 'vue';
import {ofetch} from 'ofetch';
import {useDialogStore} from '@/stores/dialogStore';

export function useFetchPaginated(url, options) {
	const dialogStore = useDialogStore();

	const {
		query: _query,
		page: _page,
		pageSize: _pageSize,
		...fetchOpts
	} = options;

	const query = ref(_query);

	const page = ref(_page);
	const pageSize = ref(_pageSize);

	const isLoading = ref(false);
	const itemCount = ref(0);
	const items = ref([]);
	const offset = computed(() => {
		return (page.value - 1) * pageSize.value;
	});

	let lastRequestController = null;

	async function fetch() {
		if (lastRequestController) {
			// abort in-flight request
			lastRequestController.abort();
		}
		lastRequestController = new AbortController();

		const queryParams = {
			offset: offset.value,
			count: pageSize.value,
			...query.value,
		};

		const signal = lastRequestController.signal;

		const opts = {
			query: queryParams,
			...fetchOpts,
			signal,
		};

		isLoading.value = true;
		try {
			const result = await ofetch(url.value, opts);
			items.value = result.items;
			itemCount.value = result.itemsMax;
		} catch (e) {
			items.value = [];
			itemCount.value = 0;

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

	const pagination = computed(() => {
		const firstItemIndex = itemCount.value ? offset.value + 1 : 0;
		const lastItemIndex = Math.min(
			offset.value + pageSize.value,
			itemCount.value,
		);
		const pageCount = Math.ceil(itemCount.value / pageSize.value);
		return {
			page: page.value,
			pageSize: pageSize.value,
			pageCount,
			firstItemIndex,
			lastItemIndex,
			itemCount: itemCount.value,
			offset: offset.value,
		};
	});

	return {
		items,
		isLoading,
		pagination,
		fetch,
	};
}
