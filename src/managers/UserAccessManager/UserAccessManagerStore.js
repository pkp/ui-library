import {defineComponentStore} from '@/utils/defineComponentStore';
import {useUrl} from '@/composables/useUrl';
import {useAnnouncer} from '@/composables/useAnnouncer';
import {useLocalize} from '@/composables/useLocalize';
import {useFetchPaginated} from '@/composables/useFetchPaginated';
import {ref, watch, computed} from 'vue';
import {useUserAccessManagerActions} from './useUserAccessManagerActions';
import {useUserAccessManagerConfig} from './useUserAccessManagerConfig';
import {useExtender} from '@/composables/useExtender';

export const useUserAccessManagerStore = defineComponentStore(
	'userAccessManager',
	() => {
		const extender = useExtender();
		const {t} = useLocalize();
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

		const {apiUrl} = useUrl('users');
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
		 * Config
		 */
		const userAccessManagerConfig = extender.addFns(
			useUserAccessManagerConfig(),
		);

		const columns = computed(() => userAccessManagerConfig.getColumns());

		const topItems = computed(() => userAccessManagerConfig.getTopItems());

		function getItemActions({user}) {
			return userAccessManagerConfig.getItemActions({user});
		}

		/*
		 * redirect to send invitation page
		 */
		function editUser({user}) {
			const {redirectToPage} = useUrl(`management/settings/user/${user.id}`);
			redirectToPage();
		}

		const _userAccessActionsFns = useUserAccessManagerActions();

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
			userList,
			/** Configs*/
			columns,
			topItems,

			/** Pagination*/
			setCurrentPage,
			currentPage,
			userAccessPagination,
			isUserAccessLoading,

			/** Actions*/
			setSearchPhrase,
			sendEmail,
			disableUser,
			removeUser,
			mergeUser,
			loginAs,
			getItemActions,
			editUser,

			/**refs */
			searchPhrase,

			// Extensibility
			extender,
		};
	},
);
