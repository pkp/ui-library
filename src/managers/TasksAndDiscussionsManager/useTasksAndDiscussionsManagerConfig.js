import {useLocalize} from '@/composables/useLocalize';
import {Actions} from './useTasksAndDiscussionsManagerActions';
import {useCurrentUser} from '@/composables/useCurrentUser';

export const TasksAndDiscussionsConfigurations = {
	permissions: [
		{
			roles: [pkp.const.ROLE_ID_AUTHOR],
			actions: [Actions.TASKS_AND_DISCUSSIONS_LIST],
		},
		{
			roles: [
				pkp.const.ROLE_ID_SUB_EDITOR,
				pkp.const.ROLE_ID_MANAGER,
				pkp.const.ROLE_ID_SITE_ADMIN,
				pkp.const.ROLE_ID_ASSISTANT,
			],
			actions: [
				Actions.TASKS_AND_DISCUSSIONS_LIST,
				Actions.TASKS_AND_DISCUSSIONS_ADD,
				Actions.TASKS_AND_DISCUSSIONS_EDIT,
				Actions.TASKS_AND_DISCUSSIONS_DELETE,
				Actions.TASKS_AND_DISCUSSIONS_HISTORY,
				Actions.TASKS_AND_DISCUSSIONS_ADD_TASK_DETAILS,
			],
		},
	],
	actions: [
		Actions.TASKS_AND_DISCUSSIONS_LIST,
		Actions.TASKS_AND_DISCUSSIONS_ADD,
		Actions.TASKS_AND_DISCUSSIONS_EDIT,
		Actions.TASKS_AND_DISCUSSIONS_DELETE,
		Actions.TASKS_AND_DISCUSSIONS_HISTORY,
		Actions.TASKS_AND_DISCUSSIONS_ADD_TASK_DETAILS,
	],
};

export function useTasksAndDiscussionsConfig() {
	const {t} = useLocalize();
	const {hasCurrentUserAtLeastOneAssignedRoleInStage} = useCurrentUser();

	function getColumns() {
		const columns = [];

		columns.push({
			header: t('common.name'),
			component: 'TasksAndDiscussionsCellName',
			props: {id: 'td_name'},
		});

		columns.push({
			header: t('submission.query.activity'),
			component: 'TasksAndDiscussionsCellActivity',
			props: {id: 'td_activity'},
		});

		columns.push({
			header: t('submission.query.dueDate'),
			component: 'TasksAndDiscussionsCellDueDate',
			props: {id: 'td_dueDate'},
		});

		columns.push({
			header: t('submission.query.started'),
			component: 'TasksAndDiscussionsCellStarted',
			props: {id: 'td_started'},
		});

		columns.push({
			header: t('submission.query.closed'),
			component: 'TasksAndDiscussionsCellClosed',
			props: {id: 'td_closed'},
		});

		columns.push({
			header: t('common.moreActions'),
			headerSrOnly: true,
			component: 'TasksAndDiscussionsCellActions',
			props: {id: 'td_actions'},
		});

		return columns;
	}

	function getManagerConfig({submission, publication}) {
		const permittedActions = TasksAndDiscussionsConfigurations.actions.filter(
			(action) => {
				return TasksAndDiscussionsConfigurations.permissions.some((perm) => {
					return (
						perm.actions.includes(action) &&
						hasCurrentUserAtLeastOneAssignedRoleInStage(
							submission.value,
							pkp.const.WORKFLOW_STAGE_ID_PRODUCTION,
							perm.roles,
						)
					);
				});
			},
		);
		return {permittedActions};
	}

	function getBottomItems({config}) {
		const actions = [];
		return actions;
	}

	function getTopItems({config}) {
		const actions = [];
		return actions;
	}

	function getItemActions({config}) {
		const actions = [];
		if (config.permittedActions.includes(Actions.TASKS_AND_DISCUSSIONS_EDIT)) {
			actions.push({
				label: t('common.edit'),
				name: Actions.TASKS_AND_DISCUSSIONS_EDIT,
				icon: 'Edit',
			});
		}

		if (
			config.permittedActions.includes(Actions.TASKS_AND_DISCUSSIONS_HISTORY)
		) {
			actions.push({
				label: 'History', // TODO: add to locale key
				name: Actions.TASKS_AND_DISCUSSIONS_HISTORY,
				icon: 'History',
			});
		}

		if (
			config.permittedActions.includes(Actions.TASKS_AND_DISCUSSIONS_DELETE)
		) {
			actions.push({
				label: t('common.delete'),
				name: Actions.TASKS_AND_DISCUSSIONS_DELETE,
				icon: 'Cancel',
				isWarnable: true,
			});
		}
		return actions;
	}

	return {
		getColumns,
		getItemActions,
		getBottomItems,
		getTopItems,
		getManagerConfig,
	};
}
