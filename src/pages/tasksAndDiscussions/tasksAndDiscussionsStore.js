import {defineComponentStore} from '@/utils/defineComponentStore';

import {computed, watch} from 'vue';

import {useFetch} from '@/composables/useFetch';
import {useUrl} from '@/composables/useUrl';

import {useDataChanged} from '@/composables/useDataChanged';
import {useExtender} from '@/composables/useExtender';

export const useTasksAndDiscussionsStore = defineComponentStore(
	'tasksAndDiscussions',
	(props) => {
		const extender = useExtender();

		const relativeUrl = computed(() => {
			return `templates`;
		});

		const {apiUrl: templatesApiUrl} = useUrl(relativeUrl);

		const {data: templates, fetch: fetchTemplates} = useFetch(templatesApiUrl);

		watch(relativeUrl, () => {
			templates.value = null;
			fetchTemplates();
		});

		fetchTemplates();

		const {triggerDataChange} = useDataChanged(() => fetchTemplates());

		function triggerDataChangeCallback() {
			triggerDataChange();
		}

		const templatesList = computed(() => {
			if (!templates.value) {
				return [];
			}

			return templates.value;
		});

		return {
			templatesList,
			triggerDataChangeCallback,

			extender,
			props,
		};
	},
);
