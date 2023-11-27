import {ref, computed, watch} from 'vue';
import {getActivePinia, defineStore} from 'pinia';
import {useFetchPaginated} from '@/composables/useFetchPaginated';
import {useFiltersForm} from '@/composables/useFiltersForm';
import {useSorting} from '@/composables/useSorting';

import {useUrlSearchParams} from '@vueuse/core';
import {useAnnouncerStore} from '@/stores/announcerStore';
import {t} from '@/utils/i18n';

let initState = null;

export function initSubmissionsPageStore(_initState) {
	initState = _initState;
}

export function disposeSubmissionsPageStore() {
	const store = useSubmissionsPageStore();
	store.$dispose();
	initState = null;
	delete getActivePinia().state.value[store.$id];
}

export const useSubmissionsPageStore = defineStore('submissionsPage', () => {
	/**
	 * Url query params
	 */
	// Reactive query params parsed from the url
	const queryParamsUrl = useUrlSearchParams();

	/**
	 * Views
	 */
	const views = ref(initState.views);
	const currentViewId = ref(
		queryParamsUrl.currentViewId &&
			views.value.find((view) => view.id === queryParamsUrl.currentViewid)
			? queryParamsUrl.currentViewId
			: initState.currentViewId,
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
	const columns = ref(initState.columns);

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
	const filtersForm = ref(initState.filtersForm);

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
	const countPerPage = ref(initState.countPerPage);
	const apiUrl = ref(initState.apiUrl);

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
			const announcerStore = useAnnouncerStore();

			announcerStore.set(t('common.loading'));

			await fetchSubmissions();
			announcerStore.set(t('common.loaded'));
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
	const assignParticipantUrl = ref(initState.assignParticipantUrl);
	const isModalOpenedAssignParticipant = ref(false);
	const isModalOpenedAssignParticipantSecondary = ref(false);

	function openAssignParticipantModal(submission) {
		if (isModalOpenedSummary.value) {
			isModalOpenedAssignParticipantSecondary.value = true;
		} else {
			selectedSubmission.value = submission;
			isModalOpenedAssignParticipant.value = true;
		}
	}
	function closeAssignParticipantModal() {
		if (isModalOpenedSummary.value) {
			isModalOpenedAssignParticipantSecondary.value = false;
		} else {
			selectedSubmission.value = null;
			isModalOpenedAssignParticipant.value = false;
		}
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
		isModalOpenedAssignParticipantSecondary,
		openAssignParticipantModal,
		closeAssignParticipantModal,
	};
});
