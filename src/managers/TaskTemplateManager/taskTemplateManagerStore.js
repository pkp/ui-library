import {defineComponentStore} from '@/utils/defineComponentStore';

import {computed} from 'vue';

import {useFetch} from '@/composables/useFetch';
import {useUrl} from '@/composables/useUrl';
import {useDataChangedProvider} from '@/composables/useDataChangedProvider';
import {useExtender} from '@/composables/useExtender';

import {useTaskTemplateManagerConfig} from './useTaskTemplateManagerConfig';
import {useTaskTemplateActions} from './useTaskTemplateManagerActions';

export const useTaskTemplateManagerStore = defineComponentStore(
	'taskTemplateManager',
	() => {
		const extender = useExtender();

		const {apiUrl: templatesApiUrl} = useUrl('editTaskTemplates');

		const {
			data: templatesList,
			fetch: fetchTemplates,
			isLoading: isLoadingTemplates,
		} = useFetch(templatesApiUrl);

		fetchTemplates();

		const {triggerDataChange} = useDataChangedProvider(() => fetchTemplates());

		function triggerDataChangeCallback() {
			triggerDataChange();
		}

		function getTemplatesByStage(stageId) {
			return computed(() => {
				return (
					templatesList.value?.data?.filter(
						(data) => data.stageId === stageId,
					) || []
				);
			});
		}

		/**
		 * Actions
		 */
		const taskTemplateActions = useTaskTemplateActions();

		function getActionArgs() {
			return {
				config: discussionConfig.value,
			};
		}

		function templateAdd({stage}) {
			taskTemplateActions.templateAdd({stage}, triggerDataChangeCallback);
		}

		function templateEdit({taskTemplate}) {
			taskTemplateActions.templateEdit(
				{taskTemplate},
				triggerDataChangeCallback,
			);
		}

		function templateDelete({taskTemplate}) {
			taskTemplateActions.templateDelete(
				{taskTemplate},
				triggerDataChangeCallback,
			);
		}

		function templateUpdateAutoAdd({taskTemplate}) {
			taskTemplateActions.templateUpdateAutoAdd(
				{taskTemplate},
				triggerDataChangeCallback,
			);
		}

		const discussionConfig = computed(() =>
			taskTemplateManagerConfig.getManagerConfig(),
		);

		function getItemActions({taskTemplate}) {
			return taskTemplateManagerConfig.getItemActions({
				taskTemplate,
				...getActionArgs(),
			});
		}

		/** Columns */
		const taskTemplateManagerConfig = extender.addFns(
			useTaskTemplateManagerConfig(),
		);
		const columns = computed(() => taskTemplateManagerConfig.getColumns());

		const appStages = taskTemplateManagerConfig.getAppStages();
		const stagedTemplates = appStages.map((stage) => ({
			name: stage.name,
			key: stage.id,
			templates: getTemplatesByStage(stage.id),
		}));

		return {
			templatesList,
			stagedTemplates,
			isLoadingTemplates,
			triggerDataChangeCallback,

			/**
			 * Config
			 * */
			columns,
			getItemActions,

			/**
			 * Actions
			 */
			templateAdd,
			templateEdit,
			templateDelete,
			templateUpdateAutoAdd,

			extender,
		};
	},
);
