import {ref, computed} from 'vue';

/**
 * Helper to construct URLs for API and page interactions with query parameters
 * @param {string|Ref<string>} _path - The path portion of the URL
 * @param {Object|Ref<Object>} [_queryParams={}] - Query parameters to include in the URL
 * @returns {Object} Object containing API and page URLs and a redirect function
 * @throws {Error} If pkp.context.apiBaseUrl or pkp.context.pageBaseUrl are not configured
 */
export function useUrl(_path, _queryParams = {}) {
	if (typeof pkp === 'undefined' || !pkp?.context?.apiBaseUrl) {
		throw new Error('pkp.context.apiBaseUrl is not configured');
	}

	if (typeof pkp === 'undefined' || !pkp?.context?.pageBaseUrl) {
		throw new Error('pkp.context.pageBaseUrl is not configured');
	}

	// normalise to be ref even if its not passed as ref
	const path = ref(_path);
	const queryParams = ref(_queryParams);

	/**
	 * Query parameters formatted as a URL string
	 * @type {ComputedRef<string>}
	 */
	const queryParamsString = computed(() => {
		if (queryParams.value && Object.keys(queryParams.value).length) {
			return `?${new URLSearchParams(queryParams.value).toString()}`;
		}
		return '';
	});

	/**
	 * Complete API URL with path and query parameters
	 * @type {ComputedRef<string>}
	 */
	const apiUrl = computed(
		() => `${pkp.context.apiBaseUrl}${path.value}${queryParamsString.value}`,
	);

	/**
	 * Complete page URL with path and query parameters
	 * @type {ComputedRef<string>}
	 */
	const pageUrl = computed(() =>
		path.value.startsWith('http')
			? `${path.value}${queryParamsString.value}`
			: `${pkp.context.pageBaseUrl}${path.value}${queryParamsString.value}`,
	);

	/**
	 * Redirect the browser to the page URL
	 */
	function redirectToPage() {
		window.location.href = pageUrl.value;
	}

	return {apiUrl, pageUrl, redirectToPage};
}
