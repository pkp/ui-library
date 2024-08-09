import {defineComponentStore} from '@/utils/defineComponentStore';
import {useApiUrl} from '@/composables/useApiUrl';
import {useAnnouncer} from '@/composables/useAnnouncer';
import {useUrl} from '@/composables/useUrl';
import {useLocalize} from '@/composables/useLocalize';
import {useFetchPaginated} from '@/composables/useFetchPaginated';
import {computed, ref, watch} from 'vue';

export const useInvitationManagerStore = defineComponentStore(
	'invitationsPage',
	() => {
		const {t} = useLocalize();
		/** Announcer */

		const {announce} = useAnnouncer();
		/**
		 * redirect to send invitation page
		 */
		const {pageUrl} = useUrl('invitation/invite');
		const sendInvitationPageUrl = computed(() => {
			return pageUrl.value;
		});
		function sendInvitation() {
			window.location = sendInvitationPageUrl.value;
		}

		/**
		 * get invitations twith paginations
		 */
		const invitationCount = ref(0);

		const countPerPage = ref(2);
		const currentPage = ref(1);
		function setCurrentPage(_currentPage) {
			currentPage.value = _currentPage;
		}

		const {apiUrl} = useApiUrl('invitations');
		const getInvitationApiUrl = computed(() => {
			return apiUrl.value;
		});
		const {
			items: invitations,
			pagination: invitationsPagination,
			isLoading: isInvitationLoading,
			fetch: fetchInvitation,
		} = useFetchPaginated(getInvitationApiUrl, {
			currentPage,
			pageSize: countPerPage,
		});
		watch(
			[currentPage],
			async () => {
				announce(t('common.loading'));

				await fetchInvitation();
				announce(t('common.loaded'));
			},
			{immediate: true},
		);

		/**
		 * create user full name
		 * @param String givenName
		 * @param String familyName
		 * @returns String
		 */
		function getFullName(givenName, familyName) {
			return givenName + ' ' + familyName;
		}

		return {
			invitationCount,
			setCurrentPage,
			sendInvitation,
			currentPage,
			invitationsPagination,
			pageUrl,
			// invitation table data
			invitations,
			isInvitationLoading,
			getFullName,
		};
	},
);
