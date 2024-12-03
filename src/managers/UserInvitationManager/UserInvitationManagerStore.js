import {defineComponentStore} from '@/utils/defineComponentStore';
import {useApiUrl} from '@/composables/useApiUrl';
import {useAnnouncer} from '@/composables/useAnnouncer';
import {useUrl} from '@/composables/useUrl';
import {useLocalize} from '@/composables/useLocalize';
import {useFetchPaginated} from '@/composables/useFetchPaginated';
import {useFetch} from '@/composables/useFetch';
import {useModal} from '@/composables/useModal';
import {useDate} from '@/composables/useDate';
import {ref, watch} from 'vue';
import UserInvitationManagerCancelInvitationDialogBody from './UserInvitationManagerCancelInvitationDialogBody.vue';

export const useUserInvitationManagerStore = defineComponentStore(
	'userInvitationsPage',
	() => {
		const {openDialog} = useModal();
		const {localize, t} = useLocalize();
		const {formatShortDate} = useDate();
		/** Announcer */

		const {announce} = useAnnouncer();
		/**
		 * redirect to send invitation page
		 */
		const {pageUrl: sendInvitationPageUrl} = useUrl('invitation/invite');
		function createNewInvitation() {
			window.location = sendInvitationPageUrl.value;
		}

		/**
		 * get invitations with paginations
		 */
		const invitationCount = ref(0);

		const countPerPage = ref(5);
		const currentPage = ref(1);
		function setCurrentPage(_currentPage) {
			currentPage.value = _currentPage;
		}

		const {apiUrl} = useApiUrl('invitations/userRoleAssignment');
		const {
			items: invitations,
			pagination: invitationsPagination,
			isLoading: isInvitationLoading,
			fetch: fetchInvitations,
		} = useFetchPaginated(apiUrl, {
			currentPage,
			pageSize: countPerPage,
		});
		watch(
			[currentPage],
			async () => {
				announce(t('common.loading'));

				await fetchInvitations();
				announce(t('common.loaded'));
			},
			{immediate: true},
		);

		/**
		 * get all invited user groups
		 * @param {Array} userGroups
		 * @returns
		 */
		function getAllInvitedRoles(userGroups) {
			let roles = '';
			userGroups.forEach((element) => {
				roles =
					roles +
					localize(element.userGroupName) +
					t('common.commaListSeparator');
			});

			return roles.substring(0, roles.length - 1);
		}

		function handleInvitationAction(actionName, invitationObj) {
			if (actionName === 'editInvite') {
				handleEditInvitation(invitationObj);
			} else {
				handleCancelInvitation(invitationObj);
			}
		}

		function handleEditInvitation(invitationObj) {
			openDialog({
				title: t('userInvitation.edit.title'),
				message: t('userInvitation.edit.message'),
				actions: [
					{
						label: t('userInvitation.edit.title'),
						isPrimary: true,
						callback: async (close) => {
							window.location =
								sendInvitationPageUrl.value + '/' + invitationObj.id;
						},
					},
					{
						label: t('common.cancel'),
						isWarnable: true,
						callback: (close) => {
							close();
						},
					},
				],
				modalStyle: 'primary',
			});
		}

		function handleCancelInvitation(invitationObj) {
			openDialog({
				title: t('invitation.cancelInvite.title'),
				bodyComponent: UserInvitationManagerCancelInvitationDialogBody,
				bodyProps: {
					message: t('invitation.cancelInvite.message', {
						givenName: invitationObj.existingUser
							? invitationObj.existingUser.givenName
							: invitationObj.givenName,
						familyName: invitationObj.existingUser
							? invitationObj.existingUser.familyName
							: invitationObj.familyName,
					}),
					email: invitationObj.existingUser
						? invitationObj.existingUser.email
						: invitationObj.email,
					roles: getAllInvitedRoles(invitationObj.userGroupsToAdd),
					status: t('userInvitation.status.invited', {
						date: formatShortDate(invitationObj.createdAt),
					}),
					affiliation: invitationObj.existingUser
						? localize(invitationObj.existingUser.affiliation)
						: localize(invitationObj.affiliation),
				},
				actions: [
					{
						label: t('invitation.cancelInvite.title'),
						isWarnable: true,
						callback: async (close) => {
							const {apiUrl: cancelApiUrl} = useUrl(
								`invitations/${invitationObj.id}/cancel`,
							);
							const {fetch: cancelInvitation} = useFetch(cancelApiUrl.value, {
								method: 'PUT',
								body: {},
							});

							announce(t('common.loading'));
							await cancelInvitation();
							await fetchInvitations();
							announce(t('common.loaded'));
							close();
						},
					},
					{
						label: t('common.cancel'),
						callback: (close) => {
							close();
						},
					},
				],
				modalStyle: 'negative',
			});
		}

		return {
			invitationCount,
			setCurrentPage,
			createNewInvitation,
			currentPage,
			invitationsPagination,

			invitations,
			isInvitationLoading,
			handleInvitationAction,
		};
	},
);
