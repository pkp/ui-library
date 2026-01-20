import {t} from '@/utils/i18n';
import {useApp} from '@/composables/useApp';
import {useLocalize} from '@/composables/useLocalize';
import {Actions} from './useTaskTemplateManagerActions';

const OJS_APP_STAGES = [
	{id: pkp.const.WORKFLOW_STAGE_ID_SUBMISSION, name: t('stage.submission')},
	{id: pkp.const.WORKFLOW_STAGE_ID_EXTERNAL_REVIEW, name: t('stage.review')},
	{id: pkp.const.WORKFLOW_STAGE_ID_EDITING, name: t('stage.copyediting')},
	{id: pkp.const.WORKFLOW_STAGE_ID_PRODUCTION, name: t('stage.production')},
];

const OMP_APP_STAGES = [
	{id: pkp.const.WORKFLOW_STAGE_ID_SUBMISSION, name: t('stage.submission')},
	{
		id: pkp.const.WORKFLOW_STAGE_ID_INTERNAL_REVIEW,
		name: t('stage.review.internal'),
	},
	{
		id: pkp.const.WORKFLOW_STAGE_ID_EXTERNAL_REVIEW,
		name: t('stage.review.external'),
	},
	{id: pkp.const.WORKFLOW_STAGE_ID_EDITING, name: t('stage.copyediting')},
	{id: pkp.const.WORKFLOW_STAGE_ID_PRODUCTION, name: t('stage.production')},
];

const OPS_APP_STAGES = [
	{id: pkp.const.WORKFLOW_STAGE_ID_PRODUCTION, name: t('stage.production')},
];

export const TaskTemplateManagerConfigurations = {
	permissions: [
		{
			roles: [pkp.const.ROLE_ID_MANAGER, pkp.const.ROLE_ID_SITE_ADMIN],
			actions: [
				Actions.TASK_TEMPLATES_LIST,
				Actions.TASK_TEMPLATES_ADD,
				Actions.TASK_TEMPLATES_EDIT,
				Actions.TASK_TEMPLATES_DELETE,
			],
		},
	],
	actions: [
		Actions.TASK_TEMPLATES_LIST,
		Actions.TASK_TEMPLATES_ADD,
		Actions.TASK_TEMPLATES_EDIT,
		Actions.TASK_TEMPLATES_DELETE,
	],
};

export function useTaskTemplateManagerConfig() {
	const {t} = useLocalize();
	const {isOJS, isOMP, isOPS} = useApp();

	function getColumns() {
		const columns = [];

		columns.push({
			header: t('taskTemplates.templateName'),
			component: 'TaskTemplateManagerCellName',
		});

		columns.push({
			header: t('taskTemplates.templateAutoAddAtStage'),
			component: 'TaskTemplateManagerCellAutoAdd',
		});

		columns.push({
			header: t('common.moreActions'),
			headerSrOnly: true,
			component: 'TaskTemplateManagerCellActions',
		});

		return columns;
	}

	function getManagerConfig() {
		const permittedActions = TaskTemplateManagerConfigurations.actions.filter(
			(action) => {
				return TaskTemplateManagerConfigurations.permissions.some((perm) => {
					return perm.actions.includes(action);
				});
			},
		);
		return {permittedActions};
	}

	function getItemActions({config, workItem}) {
		const actions = [];
		if (config.permittedActions.includes(Actions.TASK_TEMPLATES_EDIT)) {
			actions.push({
				label: t('common.edit'),
				name: Actions.TASK_TEMPLATES_EDIT,
				icon: 'Edit',
			});
		}

		if (config.permittedActions.includes(Actions.TASK_TEMPLATES_DELETE)) {
			actions.push({
				label: t('common.delete'),
				name: Actions.TASK_TEMPLATES_DELETE,
				icon: 'Cancel',
				isWarnable: true,
			});
		}
		return actions;
	}

	function getAppStages() {
		if (isOJS()) {
			return OJS_APP_STAGES;
		} else if (isOMP()) {
			return OMP_APP_STAGES;
		} else if (isOPS()) {
			return OPS_APP_STAGES;
		}
		return [];
	}

	return {
		getColumns,
		getItemActions,
		getManagerConfig,
		getAppStages,
	};
}
