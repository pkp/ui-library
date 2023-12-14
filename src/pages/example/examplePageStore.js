import {ref, computed} from 'vue';
import {useFetchPaginated} from '@/composables/useFetchPaginated';

import {defineComponentStore} from '@/utils/defineComponentStore';

export const useExamplePageStore = defineComponentStore(
	'examplePage',
	(pageInitConfig) => {
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
	},
);
