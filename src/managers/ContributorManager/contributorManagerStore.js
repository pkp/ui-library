import {defineComponentStore} from '@/utils/defineComponentStore';

import {computed} from 'vue';
import {useFetch} from '@/composables/useFetch';
import {useUrl} from '@/composables/useUrl';

export const useContributorManagerStore = defineComponentStore(
	'contributorManager',
	(props) => {
		const {apiUrl: contributorApiUrl} = useUrl(
			`submissions/${props.submissionId}/publications/${props.publicationId}/contributors`,
		);

		const {data, fetch: fetchContributors} = useFetch(contributorApiUrl, {
			query: {},
		});

		const contributors = computed(() => data.value?.items || []);

		fetchContributors();

		return {title: props.title, contributors, fetchContributors};
	},
);
