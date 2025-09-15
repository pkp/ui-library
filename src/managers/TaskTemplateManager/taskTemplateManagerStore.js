import {defineComponentStore} from '@/utils/defineComponentStore';

import {computed, watch} from 'vue';

import {t} from '@/utils/i18n';
import {useFetch} from '@/composables/useFetch';
import {useUrl} from '@/composables/useUrl';
import {useDataChanged} from '@/composables/useDataChanged';
import {useExtender} from '@/composables/useExtender';

import {useTaskTemplateManagerConfig} from './useTaskTemplateManagerConfig';
import {useTaskTemplateActions} from './useTaskTemplateManagerActions';

export const useTaskTemplateManagerStore = defineComponentStore(
	'taskTemplateManager',
	() => {
		const extender = useExtender();

		const relativeUrl = computed(() => {
			return `templates`;
		});

		const {apiUrl: templatesApiUrl} = useUrl(relativeUrl);

		const {data: templatesList, fetch: fetchTemplates} =
			useFetch(templatesApiUrl);

		watch(relativeUrl, () => {
			fetchTemplates({clearData: true});
		});

		fetchTemplates();

		const {triggerDataChange} = useDataChanged(() => fetchTemplates());

		function triggerDataChangeCallback() {
			triggerDataChange();
		}

		function getTemplatesByStage(stageId) {
			return computed(
				() =>
					templatesList.value?.filter((data) => data.stageId === stageId) || [],
			);
		}

		const stagedTemplates = [
			{
				name: t('stage.submission'),
				templates: getTemplatesByStage('Submission'),
			},
			{
				name: t('stage.review'),
				templates: getTemplatesByStage('Review'),
			},
			{
				name: t('stage.copyediting'),
				templates: getTemplatesByStage('Copyediting'),
			},
			{
				name: t('stage.production'),
				templates: getTemplatesByStage('Production'),
			},
		];

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
			taskTemplateActions.templateAdd(
				{
					stage,
				},
				triggerDataChangeCallback,
			);
		}

		function templateEdit({taskTemplate}) {
			taskTemplateActions.templateEdit(
				{taskTemplate},
				triggerDataChangeCallback,
			);
		}

		function templateDelete(taskTemplate) {
			taskTemplateActions.templateDelete(
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

		return {
			templatesList,
			stagedTemplates,
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

			extender,
		};
	},
);
