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
	};
}
