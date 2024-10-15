import {defineComponentStore} from '@/utils/defineComponentStore';
import {useApiUrl} from '@/composables/useApiUrl';
import {useAnnouncer} from '@/composables/useAnnouncer';
import {useUrl} from '@/composables/useUrl';
import {useTranslation} from '@/composables/useTranslation';
import {useFetchPaginated} from '@/composables/useFetchPaginated';
import {useModal} from '@/composables/useModal';
import {ref, watch} from 'vue';

export const useUserAccessManagerStore = defineComponentStore(
	'userAccessManager',
	() => {
		const {openDialog} = useModal();
		const {t} = useTranslation();
		/** Announcer */

		const {announce} = useAnnouncer();

		/**
		 * get invitations with paginations
		 */
		const userAccessCount = ref(0);

		const countPerPage = ref(25);
		const currentPage = ref(1);
		function setCurrentPage(_currentPage) {
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
			query: {searchPhrase: searchPhrase, status: 'all'},
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

		function handleUserAccessAction(actionName, userObj) {
			if (actionName === 'editUser') {
				handleEditUser(userObj);
			}
		}

		const {pageUrl: editUserPageUrl} = useUrl('user/edit');

		function handleEditUser(userObj) {
			openDialog({
				title: t('userInvitation.edit.title'),
				message: t('userInvitation.edit.message'),
				actions: [
					{
						label: t('userInvitation.edit.title'),
						isPrimary: true,
						callback: async (close) => {
							window.location = editUserPageUrl.value + '/' + userObj.id;
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

		return {
			userAccessCount,
			setCurrentPage,
			currentPage,
			userAccessPagination,
			userList,
			isUserAccessLoading,
			handleUserAccessAction,
			setSearchPhrase,
		};
	},
);
