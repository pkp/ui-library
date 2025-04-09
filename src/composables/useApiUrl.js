import {ref, computed} from 'vue';

/**
 * Helper to construct URL for API interactions
 * Query params are not included, as correct query param serialisation
 * is covered in useFetch
 * @param {string|Ref<string>} _path - The API endpoint path to append to the base URL
 * @returns {Object} - Object containing the computed API URL
 * @throws {Error} - Throws an error if pkp.context.apiBaseUrl is not configured
 */
export function useApiUrl(_path) {
	if (typeof pkp === 'undefined' || !pkp?.context?.apiBaseUrl) {
		throw new Error('pkp.context.apiBaseUrl is not configured');
	}

	// normalise to be ref even if its not passed as ref
	const path = ref(_path);

	/**
	 * The computed full API URL
	 * @type {ComputedRef<string>}
	 */
	const apiUrl = computed(() => `${pkp.context.apiBaseUrl}${path.value}`);

	return {apiUrl};
}
