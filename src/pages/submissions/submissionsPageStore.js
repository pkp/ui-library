import {computed, ref, watch} from 'vue';
import {useFetchPaginated} from '@/composables/useFetchPaginated';
import {useFiltersForm} from '@/composables/useFiltersForm';
import {useSorting} from '@/composables/useSorting';
import {useTranslation} from '@/composables/useTranslation';
import {useAnnouncer} from '@/composables/useAnnouncer';
import {useUrlSearchParams} from '@vueuse/core';
import {defineComponentStore} from '@/utils/defineComponentStore';

export const useSubmissionsPageStore = defineComponentStore(
	'submissionsPage',
	(pageInitConfig) => {
		/**
		 * Translation
		 */

		const {t} = useTranslation();

		/** Announcer */

		const {announce} = useAnnouncer();

		/**
		 * Url query params
		 */
		// Reactive query params parsed from the url
		const queryParamsUrl = useUrlSearchParams();

		/**
		 * Views
		 */
		const views = ref(pageInitConfig.views);
		const currentViewId = ref(
			queryParamsUrl.currentViewId &&
				views.value.find((view) => view.id === queryParamsUrl.currentViewId)
				? queryParamsUrl.currentViewId
				: pageInitConfig.currentViewId,
		);
		const currentView = computed(
			() => views.value.find((view) => view.id === currentViewId.value) || {},
		);
		function loadView(view) {
			currentViewId.value = view.id;
			currentPage.value = 1;
			clearFiltersForm();
			resetSearchPhrase();
		}

		/**
		 * Columns
		 */
		const columns = ref(pageInitConfig.columns);

		/**
		 * Search Phrase
		 */
		const searchPhrase = ref(queryParamsUrl.searchPhrase || '');
		function setSearchPhrase(value) {
			searchPhrase.value = value;
			currentPage.value = 1;
		}
		function resetSearchPhrase() {
			searchPhrase.value = undefined;
		}

		/**
		 * Filters form
		 */
		const filtersForm = ref(pageInitConfig.filtersForm);

		const {
			filtersFormList,
			filtersFormQueryParamsApi,
			filtersFormQueryParams,
			updateFiltersForm,
			clearFiltersForm,
			initFiltersFormFromQueryParams,
		} = useFiltersForm(filtersForm);
		// Apply query params to filtersForm
		initFiltersFormFromQueryParams(queryParamsUrl);

		/**
		 * Sorting
		 */
		const {sortDirection, sortColumnId, sortQueryParamsApi, applySort} =
			useSorting();

		/**
		 * Submissions
		 */
		const currentPage = ref(1);
		const countPerPage = ref(pageInitConfig.countPerPage);
		const apiUrl = ref(pageInitConfig.apiUrl);

		const submissionsUrl = computed(() => {
			return currentView.value?.op
				? apiUrl.value + '/' + currentView.value.op
				: apiUrl.value;
		});
		const submissionsQuery = computed(() => ({
			searchPhrase: searchPhrase.value || undefined,
			...currentView.value.queryParams,
			...filtersFormQueryParamsApi.value,
			...sortQueryParamsApi.value,
		}));
		const {
			items: submissions,
			pagination: submissionsPagination,
			isLoading: isSubmissionsLoading,
			fetch: fetchSubmissions,
		} = useFetchPaginated(submissionsUrl, {
			page: currentPage,
			pageSize: countPerPage,
			query: submissionsQuery,
		});
		watch(
			[submissionsUrl, submissionsQuery, currentPage],
			async () => {
				if (!apiUrl.value) {
					return;
				}

				announce(t('common.loading'));

				await fetchSubmissions();
				announce(t('common.loaded'));
			},
			{immediate: true},
		);

		/**
		 * Modals
		 */
		const selectedSubmission = ref(null);

		/**
		 * Summary submission Modal
		 */
		const isModalOpenedSummary = ref(false);
		function openSummaryModal(submission) {
			selectedSubmission.value = submission;
			isModalOpenedSummary.value = true;
		}
		function closeSummaryModal() {
			isModalOpenedSummary.value = false;
			selectedSubmission.value = null;
		}

		/**
		 * Filters Modal
		 */
		const isModalOpenedFilters = ref(false);
		function openFiltersModal() {
			isModalOpenedFilters.value = true;
		}
		function closeFiltersModal() {
			isModalOpenedFilters.value = false;
		}

		/**
		 * Assign Participant Modal
		 */
		const assignParticipantUrl = ref(pageInitConfig.assignParticipantUrl);
		const isModalOpenedAssignParticipant = ref(false);

		function openAssignParticipantModal(submission) {
			selectedSubmission.value = submission;
			isModalOpenedAssignParticipant.value = true;
		}
		function closeAssignParticipantModal() {
			selectedSubmission.value = null;
			isModalOpenedAssignParticipant.value = false;
		}

		/**
		 * Sync Query params
		 */

		// Calculate all query params that should be applied to the url
		const queryParamsInternal = computed(() => {
			return {
				...filtersFormQueryParams.value,
				searchPhrase: searchPhrase.value,
				currentViewId: currentViewId.value,
			};
		});

		// Apply queryParamsInternal to reactive queryParams to udpate url
		watch(queryParamsInternal, (paramsToApply) => {
			Object.keys(paramsToApply).forEach((paramKey) => {
				queryParamsUrl[paramKey] = paramsToApply[paramKey];
			});
		});

		return {
			// Views
			views,
			currentViewId,
			currentView,
			loadView,

			// Columns
			columns,

			// Search Phrase
			searchPhrase,
			setSearchPhrase,
			resetSearchPhrase,

			// Filters Form
			filtersForm,
			filtersFormList,
			filtersFormQueryParamsApi,
			filtersFormQueryParams,
			updateFiltersForm,
			clearFiltersForm,

			// Sorting
			sortDirection,
			sortColumnId,
			sortQueryParamsApi,
			applySort,

			// Submissions
			submissions,
			submissionsPagination,
			isSubmissionsLoading,
			fetchSubmissions,

			// Modals
			selectedSubmission,

			// Summary submission Modal
			isModalOpenedSummary,
			openSummaryModal,
			closeSummaryModal,

			// Filters Modal
			isModalOpenedFilters,
			openFiltersModal,
			closeFiltersModal,

			// AssignParticipant Modal
			assignParticipantUrl,
			isModalOpenedAssignParticipant,
			openAssignParticipantModal,
			closeAssignParticipantModal,
		};
	},
);
