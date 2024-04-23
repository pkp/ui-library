import {computed} from 'vue';

import {defineComponentStore} from '@/utils/defineComponentStore';
import {useEditorialLogic} from './useEditorialLogic';
import {useFetch} from '@/composables/useFetch';
import {useUrl} from '@/composables/useUrl';

export const useSubmissionSummaryStore = defineComponentStore(
	'submissionSummary',
	(initValues) => {
		/**
		 * Fetch submission details
		 */
		const {apiUrl} = useUrl(
			`submissions/${encodeURIComponent(initValues.submissionId)}`,
		);
		const {data: submission, fetch} = useFetch(apiUrl);

		fetch();

		const {getSummaryModalConfig} = useEditorialLogic();

		const summaryConfig = computed(() => {
			if (submission.value) {
				return getSummaryModalConfig(submission.value);
			}
			return null;
		});
		return {
			submission,
			summaryConfig,
		};
	},
);
