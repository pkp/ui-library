import {ref, computed} from 'vue';
/**
 *  Helper to construct url for API interactions
 *  Query params are not included, as correct query param serialisation
 *  is covered in useFetch
 */

export function useUrl(_path) {
	if (typeof pkp === 'undefined' || !pkp?.context?.apiBaseUrl) {
		throw new Error('pkp.context.apiBaseUrl is not configured');
	}

	if (typeof pkp === 'undefined' || !pkp?.context?.pageBaseUrl) {
		throw new Error('pkp.context.pageBaseUrl is not configured');
	}

	// normalise to be ref even if its not passed as ref
	const path = ref(_path);

	const apiUrl = computed(() => `${pkp.context.apiBaseUrl}${path.value}`);
	const pageUrl = computed(() => `${pkp.context.pageBaseUrl}${path.value}`);

	return {apiUrl, pageUrl};
}
