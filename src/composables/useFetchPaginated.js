import {ref, computed} from 'vue';

import {useFetch} from './useFetch';

export function useFetchPaginated(url, options) {
	const {
		page: _page,
		pageSize: _pageSize,
		query: _query,
		...useFetchOpts
	} = options;

	// normalise to make these options reactive if they are not already
	const page = ref(_page);
	const pageSize = ref(_pageSize);
	const query = ref(_query || {});

	// add offset and count to query params
	const offset = computed(() => {
		return (page.value - 1) * pageSize.value;
	});
	const useFetchQuery = computed(() => {
		return {...query.value, offset: offset.value, count: pageSize.value};
	});

	const {data, isLoading, fetch} = useFetch(url, {
		...useFetchOpts,
		query: useFetchQuery,
	});

	const items = computed(() => data.value?.items);
	const itemCount = computed(() => data.value?.itemsMax);

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
