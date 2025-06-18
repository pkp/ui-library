import {useLocalize} from '@/composables/useLocalize';
import {useCurrentUser} from '@/composables/useCurrentUser';

// TODO: Define actions

export const TasksAndDiscussionsConfigurations = {
	permissions: [
		{
			roles: [pkp.const.ROLE_ID_AUTHOR],
			actions: [],
		},
		{
			roles: [
				pkp.const.ROLE_ID_SUB_EDITOR,
				pkp.const.ROLE_ID_MANAGER,
				pkp.const.ROLE_ID_SITE_ADMIN,
				pkp.const.ROLE_ID_ASSISTANT,
			],
			actions: [],
		},
	],
	actions: [],
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
		const permittedActions = TasksAndDiscussionsConfigurations.actions
			.filter((action) => {
				if (
					publication.value.status === pkp.const.STATUS_PUBLISHED &&
					TasksAndDiscussionsConfigurations.actionsRequiresUnpublishedState.includes(
						action,
					)
				) {
					return false;
				}

				return true;
			})
			.filter((action) => {
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
			});
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
