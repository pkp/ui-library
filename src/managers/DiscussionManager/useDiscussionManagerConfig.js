import {useLocalize} from '@/composables/useLocalize';
import {Actions} from './useDiscussionManagerActions';
import {useCurrentUser} from '@/composables/useCurrentUser';

export const DiscussionManagerConfigurations = {
	permissions: [
		{
			roles: [
				pkp.const.ROLE_ID_SUB_EDITOR,
				pkp.const.ROLE_ID_MANAGER,
				pkp.const.ROLE_ID_SITE_ADMIN,
				pkp.const.ROLE_ID_ASSISTANT,
				pkp.const.ROLE_ID_AUTHOR,
				pkp.const.ROLE_ID_REVIEWER,
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
	const {
		hasCurrentUserAtLeastOneAssignedRoleInStage,
		isCurrentUserAssignedAsReviewer,
		isCurrentUserJournalManager,
		getCurrentUserId,
	} = useCurrentUser();

	function getColumns() {
		const columns = [];

		columns.push({
			header: t('common.name'),
			component: 'DiscussionManagerCellName',
		});

		columns.push({
			header: t('submission.query.activityName'),
			component: 'DiscussionManagerCellActivity',
		});

		columns.push({
			header: t('common.dueDate'),
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

	function getManagerConfig({submission, submissionStageId}) {
		const permittedActions = DiscussionManagerConfigurations.actions.filter(
			(action) => {
				return DiscussionManagerConfigurations.permissions.some((perm) => {
					return (
						(perm.actions.includes(action) &&
							hasCurrentUserAtLeastOneAssignedRoleInStage(
								submission.value,
								submissionStageId,
								perm.roles,
							)) ||
						isCurrentUserAssignedAsReviewer(submission.value)
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

	// Check if the current user has edit/delete access to the work item
	// (being the journal manager, the owner, or the responsible participant)
	function userHasWriteAccess({workItem} = {}) {
		const participants = workItem?.participants;
		const currentUserId = getCurrentUserId();
		const responsibleParticipantId = findResponsibleParticipantId(participants);
		const isCurrentUserResponsibleParticipant =
			responsibleParticipantId === currentUserId;
		const isCurrentUserTheOwner = workItem?.createdBy === currentUserId;

		return (
			isCurrentUserJournalManager() ||
			isCurrentUserTheOwner ||
			isCurrentUserResponsibleParticipant
		);
	}

	function findResponsibleParticipantId(participants = []) {
		return participants.find((p) => p?.isResponsible)?.userId ?? null;
	}

	function getItemActions({config, workItem = {}}) {
		const actions = [];
		const currentUserHasWriteAccess = userHasWriteAccess({workItem});
		if (currentUserHasWriteAccess) {
			actions.push({
				label: t('common.edit'),
				name: Actions.TASKS_AND_DISCUSSIONS_EDIT,
				icon: 'Edit',
				disabled: !!workItem?.dateClosed,
			});

			if (
				workItem.type === pkp.const.EDITORIAL_TASK_TYPE_DISCUSSION &&
				workItem.status === pkp.const.EDITORIAL_TASK_STATUS_IN_PROGRESS &&
				currentUserHasWriteAccess
			) {
				actions.push({
					label: t('discussion.addTaskDetails'),
					name: Actions.TASKS_AND_DISCUSSIONS_ADD_TASK_DETAILS,
					icon: 'TaskDetails',
				});
			}
		}

		if (
			config.permittedActions.includes(Actions.TASKS_AND_DISCUSSIONS_HISTORY) &&
			currentUserHasWriteAccess
		) {
			actions.push({
				label: t('common.history'),
				name: Actions.TASKS_AND_DISCUSSIONS_HISTORY,
				icon: 'History',
			});
		}

		if (
			config.permittedActions.includes(Actions.TASKS_AND_DISCUSSIONS_DELETE) &&
			currentUserHasWriteAccess
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
		userHasWriteAccess,
	};
}
