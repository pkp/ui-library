import {useLocalize} from '@/composables/useLocalize';
import {Actions} from './useDiscussionManagerActions';
import {useCurrentUser} from '@/composables/useCurrentUser';

export const DiscussionManagerConfigurations = {
	permissions: [
		{
			roles: [pkp.const.ROLE_ID_AUTHOR],
			actions: [
				Actions.TASKS_AND_DISCUSSIONS_LIST,
				Actions.TASKS_AND_DISCUSSIONS_SEARCH,
			],
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
				Actions.TASKS_AND_DISCUSSIONS_SEARCH,
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
		Actions.TASKS_AND_DISCUSSIONS_SEARCH,
		Actions.TASKS_AND_DISCUSSIONS_EDIT,
		Actions.TASKS_AND_DISCUSSIONS_DELETE,
		Actions.TASKS_AND_DISCUSSIONS_HISTORY,
		Actions.TASKS_AND_DISCUSSIONS_ADD_TASK_DETAILS,
	],
};

export function useDiscussionManagerConfig() {
	const {t} = useLocalize();
	const {hasCurrentUserAtLeastOneAssignedRoleInStage} = useCurrentUser();

	function getColumns() {
		const columns = [];

		columns.push({
			header: t('common.name'),
			component: 'DiscussionManagerCellName',
		});

		columns.push({
			header: t('submission.query.activity'),
			component: 'DiscussionManagerCellActivity',
		});

		columns.push({
			header: t('submission.query.dueDate'),
			component: 'DiscussionManagerCellDueDate',
		});

		columns.push({
			header: t('submission.query.started'),
			component: 'DiscussionManagerCellStarted',
		});

		columns.push({
			header: t('submission.query.closed'),
			component: 'DiscussionManagerCellClosed',
		});

		columns.push({
			header: t('common.moreActions'),
			headerSrOnly: true,
			component: 'DiscussionManagerCellActions',
		});

		return columns;
	}

	function getManagerConfig({submission, publication}) {
		const permittedActions = DiscussionManagerConfigurations.actions.filter(
			(action) => {
				return DiscussionManagerConfigurations.permissions.some((perm) => {
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

	function getTopItems({config, discussions}) {
		const actions = [];
		const enabledActions = config.permittedActions;

		if (
			enabledActions.includes(Actions.TASKS_AND_DISCUSSIONS_SEARCH) &&
			discussions.length
		) {
			actions.push({
				component: 'DiscussionManagerActionButton',
				props: {
					label: t('common.search'),
					action: Actions.TASKS_AND_DISCUSSIONS_SEARCH,
				},
			});
		}

		if (enabledActions.includes(Actions.TASKS_AND_DISCUSSIONS_ADD)) {
			actions.push({
				component: 'DiscussionManagerActionButton',
				props: {
					label: t('common.add'),
					action: Actions.TASKS_AND_DISCUSSIONS_ADD,
				},
			});
		}

		return actions;
	}

	function getItemActions({config, workItem}) {
		const actions = [];
		if (config.permittedActions.includes(Actions.TASKS_AND_DISCUSSIONS_EDIT)) {
			actions.push({
				label: t('common.edit'),
				name: Actions.TASKS_AND_DISCUSSIONS_EDIT,
				icon: 'Edit',
			});
		}

		if (workItem.type === 'Discussion') {
			actions.push({
				label: t('discussion.addTaskDetails'),
				name: Actions.TASKS_AND_DISCUSSIONS_ADD_TASK_DETAILS,
				icon: 'TaskDetails',
			});
		}

		if (
			config.permittedActions.includes(Actions.TASKS_AND_DISCUSSIONS_HISTORY)
		) {
			actions.push({
				label: t('common.history'),
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
