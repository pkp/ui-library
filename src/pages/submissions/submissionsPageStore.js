import {ref, computed, watch} from 'vue';
import {defineStore} from 'pinia';
import {useFetchPaginated} from './useFetchPaginated';
import {useFiltersForm} from './useFiltersForm';
import {useSorting} from './useSorting';

import {useUrlSearchParams} from '@vueuse/core';
import {useDialogStore} from '@/stores/dialogStore';
import {useAnnouncerStore} from '@/stores/announcerStore';
import {t} from '@/utils/i18n';
export const useSubmissionsPageStore = defineStore(
	'submissionsPage',
	(context) => {
		console.log('contextLog', context, this);
		/**
		 * Init
		 */
		function init(initData) {
			apiUrl.value = initData.apiUrl;
			views.value = initData.views;
			// verify if views id from url does exist among views, otherwise fallback to default one
			currentViewId.value =
				queryParamsUrl.currentViewId &&
				views.value.find((view) => view.id === queryParamsUrl.currentViewid)
					? queryParamsUrl.currentViewId
					: initData.currentViewId;
			columns.value = initData.columns;
			countPerPage.value = initData.countPerPage;
			filtersForm.value = initData.filtersForm;
		}

		/**
		 * Url query params
		 */
		// Reactive query params parsed from the url
		const queryParamsUrl = useUrlSearchParams();

		/**
		 * Views
		 */
		const views = ref([]);
		const currentViewId = ref(null);
		const currentView = computed(
			() => views.value.find((view) => view.id === currentViewId.value) || {},
		);
		function loadView(view) {
			console.log('load view');
			currentViewId.value = view.id;
			currentPage.value = 1;
			clearFiltersForm();
			resetSearchPhrase();
		}

		/**
		 * Columns
		 */
		const columns = ref([]);

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
		const filtersForm = ref({fields: []});

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
		const countPerPage = ref(0);
		const apiUrl = ref('');

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
		watch([submissionsUrl, submissionsQuery, currentPage], async () => {
			if (!apiUrl.value) {
				return;
			}
			const dialogStore = useDialogStore();
			const announcerStore = useAnnouncerStore();

			console.log('fetch!');
			announcerStore.set(t('common.loading'));

			try {
				await fetchSubmissions();
				announcerStore.set(t('common.loaded'));
			} catch (e) {
				// aborted by subsequent request
				if (e.aborted === true) {
					return null;
				}

				dialogStore.openDialogNetworkError(e);
			}
		});

		/**
		 * Summary submission Modal
		 */
		const isModalOpenedSummary = ref(false);
		const summarySubmission = ref(null);
		function openSummaryModal(submission) {
			summarySubmission.value = submission;
			isModalOpenedSummary.value = true;
		}
		function closeSummaryModal() {
			isModalOpenedSummary.value = false;
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
			init,

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

			// Summary submission Modal
			summarySubmission,
			isModalOpenedSummary,
			openSummaryModal,
			closeSummaryModal,

			// Filters Modal
			isModalOpenedFilters,
			openFiltersModal,
			closeFiltersModal,
		};
	},
);
