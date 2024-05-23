import {defineComponentStore} from '@/utils/defineComponentStore';

import {ref, computed} from 'vue';
import {useFetch} from '@/composables/useFetch';
import {useUrl} from '@/composables/useUrl';

export const useFileManagerStore = defineComponentStore(
	'fileManager',
	(props) => {
		const submissionId = ref(props.submissionId);

		const {apiUrl: filesApiUrl} = useUrl(
			`submissions/${submissionId.value}/files`,
		);

		const {data, fetch: fetchFiles} = useFetch(filesApiUrl, {
			query: {
				fileStages: props.fileStages,
				reviewRoundId: props.reviewRoundId,
			},
		});

		const files = computed(() => data.value?.items);

		fetchFiles();

		return {title: props.title, files, fetchFiles};
	},
);
