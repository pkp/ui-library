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

	const templatesQuery = computed(() => ({
		stageId: submissionStageId,
		search: searchPhrase.value || undefined,
	}));

	const {apiUrl: taskTemplatesApiUrl} = useUrl('editTaskTemplates');

	const {items: taskTemplatesData, fetch: fetchTaskTemplates} =
		useFetchPaginated(taskTemplatesApiUrl, {
			page: 1,
			pageSize: 999,
			query: templatesQuery,
		});

	watch(templatesQuery, () => {
		fetchTaskTemplates({clearData: true});
	});

	fetchTaskTemplates();

	return {
		taskTemplatesData,
		searchPhrase,
	};
}
