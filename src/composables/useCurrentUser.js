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

	function getCurrentUserName() {
		return pkp.currentUser.username;
	}

	function getCurrentUserFullName() {
		return pkp.currentUser.fullName;
	}

	function getCurrentUserInitials() {
		return pkp.currentUser.initials;
	}

	function getUserLoggedInAsUserName() {
		if (!isUserLoggedInAs()) {
			return '';
		}

		const userLoggedInAs = getUserLoggedInAs();
		return userLoggedInAs?.username || '';
	}

	function getUserLoggedInAsInitials() {
		if (!isUserLoggedInAs()) {
			return '';
		}

		const userLoggedInAs = getUserLoggedInAs();
		return userLoggedInAs?.initials || '';
	}

	function getUnreadNotifications() {
		return pkp.currentUser.unreadTasksCount;
	}

	function setUnreadNotifications(count) {
		pkp.currentUser.unreadTasksCount = count;
		return pkp.currentUser.unreadTasksCount;
	}

	function isUserLoggedInAs() {
		return pkp.currentUser.isUserLoggedInAs;
	}

	function getUserLoggedInAs() {
		return pkp.currentUser.loggedInAsUser;
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

	function isCurrentUserAssignedAsReviewer(submission) {
		const {getActiveReviewAssignments} = useSubmission();

		return getActiveReviewAssignments(submission.reviewAssignments).some(
			(reviewAssignment) => reviewAssignment.isCurrentUserAssigned,
		);
	}

	return {
		hasCurrentUserAtLeastOneRole,
		getCurrentUserId,
		hasCurrentUserAtLeastOneAssignedRoleInStage,
		hasCurrentUserAtLeastOneAssignedRoleInAnyStage,
		isCurrentUserAssignedAsReviewer,
		getUnreadNotifications,
		setUnreadNotifications,
		isUserLoggedInAs,
		getUserLoggedInAs,
		getCurrentUserFullName,
		getCurrentUserName,
		getCurrentUserInitials,
		getUserLoggedInAsUserName,
		getUserLoggedInAsInitials,
	};
}
