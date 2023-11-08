import {ref, watch, computed} from 'vue';
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
	const pagesCount = ref(0);
	const firstItemIndex = ref(0);
	const lastItemIndex = ref(0);

	// fetch everytime query/page/pageSize changes
	const offset = computed(() => {
		return (page.value - 1) * pageSize.value;
	});
	watch(
		[url, query, page, pageSize],
		async ([url, query, page, pageSize]) => {
			console.log('fetch triggered', console.log(page, pageSize));
			const queryParams = {
				offset: offset.value,
				count: pageSize,
				...query,
			};
			const opts = {
				query: queryParams,
				...fetchOpts,
			};

			isLoading.value = true;

			const result = await ofetch(url, opts);
			items.value = result.items;
			itemCount.value = result.itemsMax;
			isLoading.value = false;
		},
		{immediate: true},
	);

	return ref({
		isLoading,
		itemCount,
		items,
		page,
		pageSize,
		pagesCount, //  Math.ceil(this.submissionsCount / this.countPerPage);
		firstItemIndex,
		lastItemIndex,
		offset,
		//fetch,
	});
}
