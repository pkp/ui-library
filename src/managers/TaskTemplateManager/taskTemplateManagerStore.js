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

		function getTemplatesByStage(stageId) {
			return props.templates?.filter((data) => data.stageId === stageId) || [];
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
				templates,
			};
		}

		function templateAdd(stageId) {
			taskTemplateActions.templateAdd(
				{
					stageId,
				},
				triggerDataChangeCallback,
			);
		}
		function templateEdit(template) {
			taskTemplateActions.templateEdit({template}, triggerDataChangeCallback);
		}
		function templateDelete(template) {
			taskTemplateActions.templateDelete({template}, triggerDataChangeCallback);
		}

		const discussionConfig = computed(() =>
			taskTemplateManagerConfig.getManagerConfig(),
		);

		function getItemActions({template}) {
			return taskTemplateManagerConfig.getItemActions({
				template,
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
			props,
		};
	},
);
