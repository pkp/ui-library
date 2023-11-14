import {ref, computed} from 'vue';
import {ofetch} from 'ofetch';

export function useFetchPaginated(url, options) {
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

	async function fetch() {
		const queryParams = {
			offset: offset.value,
			count: pageSize.value,
			...query.value,
		};
		const opts = {
			query: queryParams,
			...fetchOpts,
		};

		isLoading.value = true;

		const result = await ofetch(url.value, opts);
		items.value = result.items;
		itemCount.value = result.itemsMax;
		isLoading.value = false;
	}

	const pagination = computed(() => {
		const firstItemIndex = offset.value + 1;
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
