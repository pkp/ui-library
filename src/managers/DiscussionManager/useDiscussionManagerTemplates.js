import {ref, watch, computed} from 'vue';
import {useUrl} from '@/composables/useUrl';
import {useFetchPaginated} from '@/composables/useFetchPaginated';

export function useDiscussionManagerTemplates(props) {
	const {inDisplayMode, submissionStageId} = props;
	const searchPhrase = ref('');

	if (inDisplayMode) {
		return {
			taskTemplatesData: [],
			searchPhrase,
		};
	}

	const urlPath = `editTaskTemplates?stageId=${submissionStageId}}`;

	const templatesQuery = computed(() => ({
		search: searchPhrase.value || undefined,
	}));

	const {apiUrl: taskTemplatesApiUrl} = useUrl(urlPath);

	const {items: taskTemplatesData, fetch: fetchTaskTemplates} =
		useFetchPaginated(taskTemplatesApiUrl, {
			page: 1,
			pageSize: 999,
			query: templatesQuery,
		});

	watch(templatesQuery, () => {
		fetchTaskTemplates();
	});

	fetchTaskTemplates({clearData: true});

	return {
		taskTemplatesData,
		searchPhrase,
	};
}
