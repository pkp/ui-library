import {useTranslation} from '@/composables/useTranslation';
import {defineComponentStore} from '@/utils/defineComponentStore';
import {useApiUrl} from '@/composables/useApiUrl';
import {useUrl} from '@/composables/useUrl';
import {useFetch} from '@/composables/useFetch';
import {useAnnouncer} from '@/composables/useAnnouncer';
import {computed, ref, watch} from 'vue';
//let pageInitConfig = null;

/*export function initSubmissionsPageStore(_pageInitConfig) {
	pageInitConfig = _pageInitConfig;
}

export function disposeSubmissionsPageStore() {
	const store = useSubmissionsPageStore();
	store.$dispose();
	pageInitConfig = null;
	delete getActivePinia().state.value[store.$id];
}*/

export const useInvitationsPageStore = defineComponentStore(
	'invitationsPage',
	(pageInitConfig) => {
		/**
		 * Translation
		 */

		const {t} = useTranslation();

		/** Announcer */

		const {announce} = useAnnouncer();
		const pageTitle = ref(null);
		const invitationCount = ref(0);

		const currentPage = ref(1);
		function setCurrentPage(_currentPage) {
			currentPage.value = _currentPage;
		}

		const {apiUrl} = useApiUrl('invitations');
		const getInvitationApiUrl = computed(() => {
			return apiUrl.value;
		});

		const {pageUrl} = useUrl('management/settings/invitations');
		const sendInvitationPageUrl = computed(() => {
			return pageUrl.value;
		});

		function sendInvitation() {
			window.location = sendInvitationPageUrl.value;
		}
		const {
			data: invitations,
			isLoading: isInvitationLoading,
			fetch: fetchInvitation,
		} = useFetch(getInvitationApiUrl, {
			query: {page: currentPage},
		});
		watch(
			[currentPage],
			async () => {
				announce(t('common.loading'));

				await fetchInvitation();
				announce(t('common.loaded'));
				console.log(invitations.value);
			},
			{immediate: true},
		);

		return {
			pageTitle,
			invitationCount,
			setCurrentPage,
			sendInvitation,
			currentPage,
			// invitation table data
			invitations,
			isInvitationLoading,
		};
	},
);
