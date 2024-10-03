import {useUrlSearchParams} from '@vueuse/core';

const queryParams = useUrlSearchParams();

export function useQueryParams() {
	return queryParams;
}
