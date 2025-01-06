import {useSubmission} from './useSubmission';

export const EditorialRoles = [
	pkp.const.ROLE_ID_SITE_ADMIN,
	pkp.const.ROLE_ID_MANAGER,
	pkp.const.ROLE_ID_SUB_EDITOR,
	pkp.const.ROLE_ID_ASSISTANT,
];

export function useCurrentUser() {
	function hasCurrentUserAtLeastOneRole(roles = []) {
		return roles.some((role) => pkp.currentUser.roles.includes(role));
	}

	function getCurrentUserId() {
		return pkp.currentUser.id;
	}

	function hasCurrentUserAtLeastOneAssignedRoleInStage(
		submission,
		stageId,
		roles = [],
	) {
		const {getStageById} = useSubmission();
		const assignedRoleIds = [];

		const stage = getStageById(submission, stageId);
		stage.currentUserAssignedRoles.forEach((assignedRoleId) => {
			if (!assignedRoleIds.includes(assignedRoleId)) {
				assignedRoleIds.push(assignedRoleId);
			}
		});

		return roles.some((role) => assignedRoleIds.includes(role));
	}

	function hasCurrentUserAtLeastOneAssignedRoleInAnyStage(
		submission,
		roles = [],
	) {
		const assignedRoleIds = [];
		submission.stages.forEach((stage) => {
			stage.currentUserAssignedRoles.forEach((assignedRoleId) => {
				if (!assignedRoleIds.includes(assignedRoleId)) {
					assignedRoleIds.push(assignedRoleId);
				}
			});
		});

		return roles.some((role) => assignedRoleIds.includes(role));
	}

	return {
		hasCurrentUserAtLeastOneRole,
		getCurrentUserId,
		hasCurrentUserAtLeastOneAssignedRoleInStage,
		hasCurrentUserAtLeastOneAssignedRoleInAnyStage,
	};
}
