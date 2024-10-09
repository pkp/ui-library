import {defineComponentStore} from '@/utils/defineComponentStore';
import {useApiUrl} from '@/composables/useApiUrl';
import {useAnnouncer} from '@/composables/useAnnouncer';
import {useUrl} from '@/composables/useUrl';
import {useLocalize} from '@/composables/useLocalize';
import {useTranslation} from '@/composables/useTranslation';
import {useFetchPaginated} from '@/composables/useFetchPaginated';
import {useFetch} from '@/composables/useFetch';
import {useModal} from '@/composables/useModal';
import {useDate} from '@/composables/useDate';
import {ref, watch} from 'vue';
import UserAccessManagerCancelInvitationDialogBody from './UserAccessManagerCancelInvitationDialogBody.vue';

export const useUserAccessManagerStore = defineComponentStore(
	'userInvitationsPage',
	() => {
		const {openDialog} = useModal();
		const {localize} = useLocalize();
		const {t} = useTranslation();
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

		const {apiUrl} = useApiUrl('users');
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

		function handleInvitationAction(actionName, userObj) {
			if (actionName === 'editUser') {
				handleEditUser(userObj);
			} else {
				handleCancelInvitation(userObj);
			}
		}

		function handleEditUser(userObj) {
			openDialog({
				title: t('userInvitation.edit.title'),
				message: t('userInvitation.edit.message'),
				actions: [
					{
						label: t('userInvitation.edit.title'),
						isPrimary: true,
						callback: async (close) => {
							window.location = sendInvitationPageUrl.value + '/' + userObj.id;
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
			});
		}

		function handleCancelInvitation(invitationObj) {
			openDialog({
				title: t('invitation.cancelInvite.title'),
				bodyComponent: UserAccessManagerCancelInvitationDialogBody,
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
					status:
						t('userInvitation.status.invited') +
						formatShortDate(invitationObj.createdAt),
					affiliation: invitationObj.affiliation
						? invitationObj.affiliation
						: '',
				},
				actions: [
					{
						label: t('invitation.cancelInvite.title'),
						isPrimary: true,
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
						isWarnable: true,
						callback: (close) => {
							close();
						},
					},
				],
			});
		}
		/**
		const searchPhrase = computed(() => {
			let searchText = '';
			if (fields.value.email) {
				searchText = fields.value.email + ' ';
			}
			if (fields.value.orcid) {
				searchText = searchText + fields.value.orcid + ' ';
			}
			if (fields.value.username) {
				searchText = searchText + fields.value.username;
			}

			return searchText;
		});
			**/
		async function search(fieldName, b, fieldValue) {}

		return {
			invitationCount,
			setCurrentPage,
			createNewInvitation,
			currentPage,
			invitationsPagination,
			invitations,
			isInvitationLoading,
			handleInvitationAction,
			search,
		};
	},
);
