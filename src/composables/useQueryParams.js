import {useUrlSearchParams} from '@vueuse/core';

/**
 * Reactive object containing the current URL search parameters
 * @type {Object}
 */
const queryParams = useUrlSearchParams();

/**
 * Provides access to URL query parameters with reactive properties
 * @returns {Object} Reactive object containing URL query parameters
 */
export function useQueryParams() {
	return queryParams;
}
