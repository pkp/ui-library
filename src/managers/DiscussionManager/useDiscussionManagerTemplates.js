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

	const urlPath = computed(
		() =>
			`editTaskTemplates?stageId=${submissionStageId}&search=${searchPhrase.value}`,
	);

	const {apiUrl: taskTemplatesApiUrl} = useUrl(urlPath);

	const {items: taskTemplatesData, fetch: fetchTaskTemplates} =
		useFetchPaginated(taskTemplatesApiUrl, {
			page: 1,
			pageSize: 999,
		});

	watch(taskTemplatesApiUrl, () => {
		taskTemplatesData.value = [];
		fetchTaskTemplates();
	});

	fetchTaskTemplates();

	return {
		taskTemplatesData,
		searchPhrase,
	};
}
