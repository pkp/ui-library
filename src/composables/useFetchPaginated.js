import {ref, computed} from 'vue';

import {useFetch} from './useFetch';

/**
 * Composable for handling paginated API requests.
 * Same options as for useFetch, only additional pagination related options are listed
 *
 * @exports
 * @function useFetchPaginated
 * @param {string} url - The URL to which the HTTP request is to be sent. This should be the endpoint for the paginated data.
 * @param {Object} options - Configuration options, check useFetch.js for more options.
 * @param {number} options.currentPage - The current page number. This is normalized internally to a reactive ref.
 * @param {number} options.pageSize - The number of items per page. This is also normalized to a reactive ref.
 *
 * @returns {Object} An object containing several reactive properties and a method for performing the fetch operation:
 * @returns {ComputedRef<Array>} return.items - A computed ref containing the items for the current page.
 * @returns {Ref<boolean>} return.isLoading - A ref object indicating whether the fetch operation is currently in progress.
 * @returns {ComputedRef<Object>} return.pagination - A computed ref providing pagination details like page number, page size, total items, etc.
 * @returns {Function} return.fetch - The function to initiate the fetch operation. This function is async and incorporates the pagination logic.
 *
 */
export function useFetchPaginated(url, options) {
	const {
		currentPage: _currentPage,
		pageSize: _pageSize,
		query: _query,
		...useFetchOpts
	} = options;

	// normalise to make these options reactive if they are not already
	const currentPage = ref(_currentPage);
	const pageSize = ref(_pageSize);
	const query = ref(_query || {});

	// add offset and count to query params
	const offset = computed(() => {
		return (currentPage.value - 1) * pageSize.value;
	});
	const useFetchQuery = computed(() => {
		return {
			...query.value,
			offset: offset.value,
			count: pageSize.value,
			page: currentPage.value,
			perPage: pageSize.value,
		};
	});

	const {data, isLoading, fetch} = useFetch(url, {
		...useFetchOpts,
		query: useFetchQuery,
	});

	const items = computed(() => data.value?.items || data.value?.data || []);
	const itemCount = computed(
		() => data.value?.itemsMax || data.value?.total || 0,
	);

	const pagination = computed(() => {
		const firstItemIndex = itemCount.value ? offset.value + 1 : 0;
		const lastItemIndex = Math.min(
			offset.value + pageSize.value,
			itemCount.value,
		);
		const pageCount = Math.ceil(itemCount.value / pageSize.value);
		return {
			currentPage: currentPage.value,
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
