import {defineComponentStore} from '@/utils/defineComponentStore';
import {computed} from 'vue';
import {useFetch} from '@/composables/useFetch';
import {useUrl} from '@/composables/useUrl';

function lazyFetch(url, queryParams = {}) {
	/**
	 * Fetch submission details
	 */
	const {apiUrl} = useUrl(url, queryParams);
	const {data, fetch, isLoading} = useFetch(apiUrl);

	const result = computed(() => {
		if (!data.value && !isLoading) {
			fetch();
		}

		return data.value;
	});

	return {result, refetch: fetch};
}

export const useSubmissionDataStore = defineComponentStore(
	'submissionData',
	(props) => {
		/**
		 * Fetch submission details
		 */
		const submissionUrl = computed(
			() => `submissions/${encodeURIComponent(props.submissionId)}`,
		);

		const {result: submission} = lazyFetch(submissionUrl);

		return {submission};
	},
);
