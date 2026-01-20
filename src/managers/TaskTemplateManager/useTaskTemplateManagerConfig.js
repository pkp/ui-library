import {useLocalize} from '@/composables/useLocalize';
import {Actions} from './useTaskTemplateManagerActions';

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

	return {
		getColumns,
		getItemActions,
		getManagerConfig,
	};
}
