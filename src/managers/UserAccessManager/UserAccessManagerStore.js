import {defineComponentStore} from '@/utils/defineComponentStore';
import {useApiUrl} from '@/composables/useApiUrl';
import {useUrl} from '@/composables/useUrl';
import {useAnnouncer} from '@/composables/useAnnouncer';
import {useTranslation} from '@/composables/useTranslation';
import {useFetchPaginated} from '@/composables/useFetchPaginated';
import {ref, watch} from 'vue';
import {useUserAccessManagerActions} from './useUserAccessManagerActions';

export const useUserAccessManagerStore = defineComponentStore(
	'userAccessManager',
	() => {
		const {t} = useTranslation();
		/** Announcer */

		const {announce} = useAnnouncer();

		/**
		 * Get users with paginations
		 */
		const userAccessCount = ref(0);

		const countPerPage = ref(25);
		const currentPage = ref(1);
		async function setCurrentPage(_currentPage) {
			currentPage.value = _currentPage;
		}

		const searchPhrase = ref('');
		async function setSearchPhrase(val) {
			searchPhrase.value = val;
		}

		const {apiUrl} = useApiUrl('users');
		const {
			items: userList,
			pagination: userAccessPagination,
			isLoading: isUserAccessLoading,
			fetch: fetchUserList,
		} = useFetchPaginated(apiUrl, {
			currentPage,
			pageSize: countPerPage,
			query: {
				searchPhrase: searchPhrase,
				status: 'all',
				includePermissions: true,
			},
		});
		watch(
			[currentPage, searchPhrase],
			async () => {
				announce(t('common.loading'));
				await fetchUserList();
				announce(t('common.loaded'));
			},
			{immediate: true},
		);

		async function triggerDataChangeCallback() {
			await fetchUserList();
		}

		/**
		 * User access table columns
		 * @returns array
		 */
		function getColumns() {
			const columns = [];

			columns.push({
				header: t('userAccess.tableHeader.name'),
				component: 'UserAccessManagerCellName',
				props: {},
			});

			columns.push({
				header: t('about.contact.email'),
				component: 'UserAccessManagerCellEmail',
				props: {},
			});

			columns.push({
				header: t('user.roles'),
				component: 'UserAccessManagerCellUserGroups',
				props: {},
			});
			columns.push({
				header: t('userAccess.tableHeader.startDate'),
				component: 'UserAccessManagerCellStartDate',
				props: {},
			});
			columns.push({
				header: t('user.affiliation'),
				component: 'UserAccessManagerCellAffiliation',
				props: {},
			});

			columns.push({
				header: t('common.moreActions'),
				component: 'UserAccessManagerCellActions',
				props: {},
				headerSrOnly: true,
			});

			return columns;
		}
		/**
		 * Actions
		 */

		/*
		 * redirect to send invitation page
		 */
		function editUser({user}) {
			const {redirectToPage} = useUrl(`invitation/editUser/${user.id}`);
			redirectToPage();
		}

		const _userAccessActionsFns = useUserAccessManagerActions();

		function getItemActions({user}) {
			return _userAccessActionsFns.getItemActions({user});
		}

		function sendEmail({user}) {
			_userAccessActionsFns.sendEmail({user}, triggerDataChangeCallback);
		}

		function disableUser({user}) {
			_userAccessActionsFns.disableUser({user}, triggerDataChangeCallback);
		}

		function removeUser({user}) {
			_userAccessActionsFns.removeUser({user}, triggerDataChangeCallback);
		}

		function mergeUser({user}) {
			_userAccessActionsFns.mergeUser({user}, triggerDataChangeCallback);
		}

		function loginAs({user}) {
			_userAccessActionsFns.loginAs({user});
		}

		return {
			userAccessCount,
			setCurrentPage,
			currentPage,
			userAccessPagination,
			userList,
			isUserAccessLoading,
			setSearchPhrase,
			sendEmail,
			disableUser,
			removeUser,
			mergeUser,
			loginAs,
			getItemActions,
			editUser,
			getColumns,
		};
	},
);
