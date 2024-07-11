import {computed} from 'vue';

export function useCurrentUser() {
	const isSiteAdmin = computed(
		() =>
			!!pkp.currentUser.roles.find(
				(role) => role === pkp.const.ROLE_ID_SITE_ADMIN,
			),
	);
	const isManager = computed(
		() =>
			!!pkp.currentUser.roles.find(
				(role) => role === pkp.const.ROLE_ID_MANAGER,
			),
	);

	function hasCurrentUserAtLeastOneRole(roles = []) {
		return roles.some((role) => pkp.currentUser.roles.includes(role));
	}

	return {isSiteAdmin, isManager, hasCurrentUserAtLeastOneRole};
}
