import {ref, computed} from 'vue';
/**
 *  Helper to construct url for API interactions
 *  Query params are not included, as correct query param serialisation
 *  is covered in useFetch
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

	const queryParamsString = computed(() => {
		if (queryParams.value && Object.keys(queryParams.value).length) {
			return `?${new URLSearchParams(queryParams.value).toString()}`;
		}
		return '';
	});

	const apiUrl = computed(
		() => `${pkp.context.apiBaseUrl}${path.value}${queryParamsString.value}`,
	);
	const pageUrl = computed(
		() => `${pkp.context.pageBaseUrl}${path.value}${queryParamsString.value}`,
	);

	function redirectToPage() {
		window.location.href = pageUrl.value;
	}

	return {apiUrl, pageUrl, redirectToPage};
}
