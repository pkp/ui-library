import {defineComponentStore} from '@/utils/defineComponentStore';

import {ref, computed} from 'vue';
import {useFetch} from '@/composables/useFetch';
import {useUrl} from '@/composables/useUrl';

export const useFileManagerStore = defineComponentStore(
	'fileManager',
	(initValues) => {
		const submissionId = ref(initValues.submissionId);

		const {apiUrl: filesApiUrl} = useUrl(
			`submissions/${submissionId.value}/files`,
		);

		const {data, fetch: fetchFiles} = useFetch(filesApiUrl, {
			query: {
				fileStages: initValues.fileStages,
				reviewRoundId: initValues.reviewRoundId,
			},
		});

		const files = computed(() => data.value?.items);
		console.log('fetchFiles:', {
			query: {
				fileStages: initValues.fileStages,
				reviewRoundId: initValues.reviewRoundId,
			},
		});
		fetchFiles();
		const title = ref('ahoj');

		return {title, files, fetchFiles};
	},
);
