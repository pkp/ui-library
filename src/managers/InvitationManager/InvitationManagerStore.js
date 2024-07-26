import {defineComponentStore} from '@/utils/defineComponentStore';
import {useApiUrl} from '@/composables/useApiUrl';
import {useUrl} from '@/composables/useUrl';
import {useFetchPaginated} from '@/composables/useFetchPaginated';
import {computed, ref, watch} from 'vue';

export const useInvitationManagerStore = defineComponentStore(
	'invitationsPage',
	() => {
		/**
		 * redirect to send invitation page
		 */
		const {pageUrl} = useUrl('invitation/send');
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

		const countPerPage = ref(10);
		const currentPage = ref(1);
		function setCurrentPage(_currentPage) {
			currentPage.value = _currentPage;
		}

		const {apiUrl} = useApiUrl('invitations');
		const getInvitationApiUrl = computed(() => {
			return apiUrl.value;
		});
		const {
			data: invitations,
			isLoading: isInvitationLoading,
			fetch: fetchInvitation,
		} = useFetchPaginated(getInvitationApiUrl, {
			currentPage,
			pageSize: countPerPage,
		});
		watch(
			[currentPage],
			async () => {
				await fetchInvitation();
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
			// invitation table data
			invitations,
			isInvitationLoading,
			getFullName,
		};
	},
);
