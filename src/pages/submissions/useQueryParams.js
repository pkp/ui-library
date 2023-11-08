import {ref, onUnmounted} from 'vue';

function getCurrentQueryParams() {
	const searchParams = new URLSearchParams(window.location.search);

	const result = {};
	for (const [key, value] of searchParams.entries()) {
		// each 'entry' is a [key, value] tupple
		result[key] = value;
	}
	return result;
}
export function useQueryParams() {
	const queryParams = ref({});

	function updateQueryParamsFromUrl() {
		queryParams.value = getCurrentQueryParams();
	}

	window.addEventListener('popstate', updateQueryParamsFromUrl);

	onUnmounted(() => {
		// Remove event listeners
		window.removeEventListener('popstate', updateQueryParamsFromUrl);
	});

	function updateQueryParams(newParams) {
		// Get the current URL
		const currentUrl = new URL(window.location);

		// Update the search parameters
		Object.keys(newParams).forEach((key) => {
			if (newParams[key] == null) {
				currentUrl.searchParams.delete(key);
			} else {
				currentUrl.searchParams.set(key, newParams[key]);
			}
		});

		// Push the new URL to the history stack
		window.history.pushState({}, '', currentUrl);
		updateQueryParamsFromUrl();
	}

	return {queryParams, updateQueryParams};
}
