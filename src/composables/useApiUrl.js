import {ref, computed} from 'vue';
/**
 *  Helper to construct url for API interactions
 *  Query params are not included, as correct query param serialisation
 *  is covered in useFetch
 */

export function useApiUrl(_path) {
	if (typeof pkp === 'undefined' || !pkp?.serverContext?.apiBaseUrl) {
		throw new Error('pkp.serverContext.apiBaseUrl is not configured');
	}

	// normalise to be ref even if its not passed as ref
	const path = ref(_path);

	const apiUrl = computed(() => `${pkp.serverContext.apiBaseUrl}${path.value}`);

	return {apiUrl};
}
