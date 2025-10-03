import {defineComponentStore} from '@/utils/defineComponentStore';

import {computed} from 'vue';

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

		const {apiUrl: templatesApiUrl} = useUrl('editTaskTemplates');

		const {data: templatesList, fetch: fetchTemplates} =
			useFetch(templatesApiUrl);

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
				key: pkp.const.WORKFLOW_STAGE_ID_SUBMISSION,
				templates: getTemplatesByStage(pkp.const.WORKFLOW_STAGE_ID_SUBMISSION),
			},
			{
				name: t('stage.review'),
				key: pkp.const.WORKFLOW_STAGE_ID_EXTERNAL_REVIEW,
				templates: getTemplatesByStage(
					pkp.const.WORKFLOW_STAGE_ID_EXTERNAL_REVIEW,
				),
			},
			{
				name: t('stage.copyediting'),
				key: pkp.const.WORKFLOW_STAGE_ID_EDITING,
				templates: getTemplatesByStage(pkp.const.WORKFLOW_STAGE_ID_EDITING),
			},
			{
				name: t('stage.production'),
				key: pkp.const.WORKFLOW_STAGE_ID_PRODUCTION,
				templates: getTemplatesByStage(pkp.const.WORKFLOW_STAGE_ID_PRODUCTION),
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

		function templateDelete({taskTemplate}) {
			taskTemplateActions.templateDelete(
				{taskTemplate},
				triggerDataChangeCallback,
			);
		}

		function templateUpdateAutoAdd({taskTemplate}) {
			taskTemplateActions.templateUpdateAutoAdd(
				{
					taskTemplate,
				},
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
			templateUpdateAutoAdd,

			extender,
		};
	},
);
