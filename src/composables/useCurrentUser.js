import {useSubmission} from './useSubmission';

/**
 * Array of role IDs considered editorial roles
 * @type {Array<number>}
 */
export const EditorialRoles = [
	pkp.const.ROLE_ID_SITE_ADMIN,
	pkp.const.ROLE_ID_MANAGER,
	pkp.const.ROLE_ID_SUB_EDITOR,
	pkp.const.ROLE_ID_ASSISTANT,
];

/**
 * Provides functions for checking current user permissions and roles
 */
export function useCurrentUser() {
	/**
	 * Check if the current user has at least one of the specified roles
	 * @param {Array<number>} [roles=[]] - Array of role IDs to check against
	 * @returns {boolean} True if the user has at least one of the specified roles
	 */
	function hasCurrentUserAtLeastOneRole(roles = []) {
		return roles.some((role) => pkp.currentUser.roles.includes(role));
	}

	/**
	 * Get the current user's ID
	 * @returns {number} The current user's ID
	 */
	function getCurrentUserId() {
		return pkp.currentUser.id;
	}

	/**
	 * Get the username of the currently logged-in user.
	 *
	 * @returns {string} The username of the user.
	 */
	function getCurrentUserName() {
		return pkp.currentUser.username;
	}

	/**
	 * Get the full name of the currently logged-in user.
	 *
	 * @returns {string} The full name of the user.
	 */
	function getCurrentUserFullName() {
		return pkp.currentUser.fullName;
	}

	/**
	 * Get the initials of the currently logged-in user.
	 *
	 * @returns {string} The initials of the user.
	 */
	function getCurrentUserInitials() {
		return pkp.currentUser.initials;
	}

	/**
	 * Get the username of the original user if they're logged in as someone.
	 *
	 * @returns {string|null} The username of the original user, or null if not impersonating.
	 */
	function getUserLoggedInAsUserName() {
		const userLoggedInAs = getUserLoggedInAs();
		return userLoggedInAs?.username || null;
	}

	/**
	 * Get the initials of the original user if they're logged in as someone.
	 *
	 * @returns {string|null} The initials of the original user, or null if not impersonating.
	 */
	function getUserLoggedInAsInitials() {
		const userLoggedInAs = getUserLoggedInAs();
		return userLoggedInAs?.initials || null;
	}

	/**
	 * Get the number of unread notifications for the current user.
	 *
	 * @returns {number} The count of unread notifications.
	 */
	function getUnreadNotifications() {
		return pkp.currentUser.unreadTasksCount;
	}

	/**
	 * Set the number of unread notifications for the current user.
	 *
	 * @param {number} count - The new count of unread notifications.
	 * @returns {number} The updated count of unread notifications.
	 */
	function setUnreadNotifications(count) {
		pkp.currentUser.unreadTasksCount = count;
		return pkp.currentUser.unreadTasksCount;
	}

	/**
	 * Check if the current user is logged in as another user.
	 *
	 * @returns {boolean} True if the user is logged in as another user, false otherwise.
	 */
	function isUserLoggedInAs() {
		return pkp.currentUser.isUserLoggedInAs;
	}

	/**
	 * Get the user object of the original user if they are logged in as someone.
	 *
	 * @returns {Object|null} The original user object, or null if not impersonating.
	 */
	function getUserLoggedInAs() {
		return pkp.currentUser.loggedInAsUser;
	}

	/**
	 * Check if the current user has at least one of the specified roles assigned in a particular stage
	 * @param {Object} submission - The submission object
	 * @param {number} stageId - The ID of the stage to check
	 * @param {Array<number>} [roles=[]] - Array of role IDs to check against
	 * @returns {boolean} True if the user has at least one of the specified roles in the stage
	 */
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

	/**
	 * Check if the current user has at least one of the specified roles assigned in any stage
	 * @param {Object} submission - The submission object
	 * @param {Array<number>} [roles=[]] - Array of role IDs to check against
	 * @returns {boolean} True if the user has at least one of the specified roles in any stage
	 */
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

	/**
	 * Check if the current user is assigned as a reviewer for the submission
	 * @param {Object} submission - The submission object
	 * @returns {boolean} True if the user is assigned as a reviewer
	 */
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
