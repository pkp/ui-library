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

	return {hasCurrentUserAtLeastOneRole, getCurrentUserId};
}
