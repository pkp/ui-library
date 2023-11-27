//import {ref, computed, watch} from 'vue';
import {getActivePinia, defineStore} from 'pinia';
import {useFetchPaginated} from '@/composables/useFetchPaginated';

let pageServerConfig = null;
export function initExamplePageStore(_pageServerConfig) {
	pageServerConfig = _pageServerConfig;
}

export function disposeExamplePageStore() {
	const store = useExamplePageStore();
	store.$dispose();
	pageServerConfig = null;
	delete getActivePinia().state.value[store.$id];
}

export const useExamplePageStore = defineStore('examplePage', () => {
	const {
		items: submissions,
		fetch: fetchSubmissions,
		isLoading,
	} = useFetchPaginated(pageServerConfig.submissionsApiUrl, {
		page: 1,
		pageSize: 20,
	});

	fetchSubmissions();
	console.log('returning example page store');
	return {submissions, fetchSubmissions, isLoading};
});
