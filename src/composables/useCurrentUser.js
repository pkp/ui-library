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

	return {isSiteAdmin, isManager};
}
