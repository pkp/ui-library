import {ref, computed} from 'vue';
import {getActivePinia, defineStore} from 'pinia';
import {useFetchPaginated} from '@/composables/useFetchPaginated';

let pageInitConfig = null;
export function initExamplePageStore(_pageInitConfig) {
	pageInitConfig = _pageInitConfig;
}

export function disposeExamplePageStore() {
	const store = useExamplePageStore();
	store.$dispose();
	pageInitConfig = null;
	delete getActivePinia().state.value[store.$id];
}

export const useExamplePageStore = defineStore('examplePage', () => {
	/**
	 * Submissions
	 */
	const {
		items: submissions,
		fetch: fetchSubmissions,
		isLoading,
	} = useFetchPaginated(pageInitConfig.submissionsApiUrl, {
		page: 1,
		pageSize: 20,
	});

	fetchSubmissions();

	/**
	 * Counter
	 */
	const counter = ref(0);
	const isCounterEven = computed(() => {
		return counter.value % 2 === 0;
	});

	function increaseCounter() {
		counter.value += 1;
	}

	return {
		/**
		 * Submissions
		 */
		submissions,
		fetchSubmissions,
		isLoading,

		/**
		 * Counter
		 */
		counter,
		isCounterEven,
		increaseCounter,
	};
});
