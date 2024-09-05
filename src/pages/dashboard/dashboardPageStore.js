import {computed, ref, watch} from 'vue';

import {useFetchPaginated} from '@/composables/useFetchPaginated';
import {useFiltersForm} from '@/composables/useFiltersForm';
import {useSorting} from '@/composables/useSorting';
import {useLocalize} from '@/composables/useLocalize';
import {useModal} from '@/composables/useModal';
import {useAnnouncer} from '@/composables/useAnnouncer';
import {useUrl} from '@/composables/useUrl';
import {useUrlSearchParams} from '@vueuse/core';
import {defineComponentStore} from '@/utils/defineComponentStore';

import {
	Actions as WorkflowActions,
	useWorkflowActions,
} from './composables/useWorkflowActions';
import {
	Actions as ReviewerManagerActions,
	useReviewerManagerActions,
} from '@/managers/ReviewerManager/useReviewerManagerActions';

import {useEditorialLogic} from './composables/useEditorialLogic';
import {useReviewActivityLogic} from './composables/useReviewActivityLogic';
import {useSubmission} from '@/composables/useSubmission';

import DashboardFiltersModal from '@/pages/dashboard/components/DashboardFiltersModal.vue';
import SubmissionSummaryModal from '@/pages/dashboard/SubmissionSummaryModal/SubmissionSummaryModal.vue';

const {t, tk} = useLocalize();

const TitleTranslations = {
	editorialDashboard: tk('dashboard.dashboards'),
	myReviewAssignments: tk('dashboard.reviewAssignments'),
	mySubmissions: tk('dashboard.mySubmissions'),
};

const TitleIcons = {
	editorialDashboard: 'Dashboard',
	myReviewAssignments: 'ReviewAssignments',
	mySubmissions: 'MySubmissions',
};

export const DashboardPageTypes = {
	EDITORIAL_DASHBOARD: 'editorialDashboard',
	MY_REVIEW_ASSIGNMENTS: 'myReviewAssignments',
	MY_SUBMISSIONS: 'mySubmissions',
};

export const useDashboardPageStore = defineComponentStore(
	'dashboardPage',
	(pageInitConfig) => {
		/**
		 * ModalStore
		 */
		const {openSideModal} = useModal();

		/** Announcer */

		const {announce} = useAnnouncer();

		/** Dashboard Page */

		const dashboardPageTitle = computed(() => {
			return t(TitleTranslations[pageInitConfig.dashboardPage]);
		});
		const dashboardPageIcon = computed(() => {
			return TitleIcons[pageInitConfig.dashboardPage];
		});

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
				: views.value[0]?.id || null,
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
			clearFiltersFormField,
			initFiltersFormFromQueryParams,
		} = useFiltersForm(filtersForm);
		// Apply query params to filtersForm
		initFiltersFormFromQueryParams(queryParamsUrl);

		/**
		 * Sorting
		 */
		const {sortDescriptor, sortQueryParamsApi, applySort} = useSorting();

		/**
		 * Submissions
		 */
		const currentPage = ref(1);
		function setCurrentPage(_currentPage) {
			currentPage.value = _currentPage;
		}
		const countPerPage = ref(pageInitConfig.countPerPage);
		const {apiUrl} = useUrl('_submissions');

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
			currentPage,
			pageSize: countPerPage,
			query: submissionsQuery,
		});
		watch(
			[submissionsUrl, submissionsQuery, currentPage],
			async () => {
				if (!apiUrl.value) {
					return;
				}

				if (currentViewId.value === null) {
					return;
				}

				announce(t('common.loading'));

				await fetchSubmissions();
				announce(t('common.loaded'));
			},
			{immediate: true},
		);

		const _workflowActionFns = useWorkflowActions(pageInitConfig);

		const _reviewerManagerActionFns = useReviewerManagerActions(pageInitConfig);

		const {getCurrentPublication} = useSubmission();
		function handleAction(actionName, actionArgs) {
			console.log('handleAction:', actionName, actionArgs);

			let actionArgsExtended = {...actionArgs};
			// TODO this should be improved, but now its to prevent accidentally
			// cherrypick submission even if the review assignments are loaded instead
			if (pageInitConfig.dashboardPage !== 'myReviewAssignments') {
				const submission = submissions.value.find(
					(submission) => submission.id === actionArgs.submissionId,
				);
				const selectedPublication = getCurrentPublication(submission);

				const actionArgsExtended = {
					...actionArgsExtended,
					submission,
					selectedPublication,
					submissionStageId: submission.stageId,
				};
			}

			if (Object.values(WorkflowActions).includes(actionName)) {
				_workflowActionFns.handleAction(
					actionName,
					actionArgsExtended,
					async () => {
						await fetchSubmissions();
					},
				);
			} else if (Object.values(ReviewerManagerActions).includes(actionName)) {
				_reviewerManagerActionFns.handleAction(
					actionName,
					actionArgsExtended,
					async () => {
						await fetchSubmissions();
					},
				);
			}
		}

		/**
		 * Modals
		 */
		const selectedSubmission = ref(null);

		/**
		 * Summary submission Modal
		 */

		/** Tracking which submissionId is opened in summary modal for query params */
		const summarySubmissionId = ref(null);
		function openSummaryModal(submissionId) {
			summarySubmissionId.value = submissionId;
			openSideModal(
				SubmissionSummaryModal,
				{
					submissionId,
					pageInitConfig,
				},
				{
					onClose: async () => {
						summarySubmissionId.value = null;
						await fetchSubmissions();
					},
				},
			);
		}
		if (queryParamsUrl.summarySubmissionId) {
			openSummaryModal(queryParamsUrl.summarySubmissionId);
		}

		/**
		 * Filters Modal
		 */
		const isModalOpenedFilters = ref(false);
		function openFiltersModal() {
			openSideModal(DashboardFiltersModal, {
				filtersFormInitial: filtersForm,
				onUpdateFiltersForm: updateFiltersForm,
			});
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
				summarySubmissionId: summarySubmissionId.value || undefined,
			};
		});

		// Apply queryParamsInternal to reactive queryParams to udpate url
		watch(queryParamsInternal, (paramsToApply) => {
			Object.keys(paramsToApply).forEach((paramKey) => {
				queryParamsUrl[paramKey] = paramsToApply[paramKey];
			});
		});

		/**
		 * Expose editorial logic function via store to make it easier
		 * to override/extend from plugins them via pinia api
		 */
		const {
			getEditorialActivityForEditorialDashboard,
			getEditorialActivityForMySubmissions,
			getEditorialActivityForMyReviewAssignments,
		} = useEditorialLogic(pageInitConfig.dashboardPage);
		const {
			getReviewActivityIndicatorProps,
			getReviewActivityIndicatorPopoverProps,
		} = useReviewActivityLogic();

		return {
			// Dashboard
			dashboardPage: pageInitConfig.dashboardPage,
			dashboardPageTitle,
			dashboardPageIcon,
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
			clearFiltersFormField,

			// Sorting
			sortDescriptor,
			sortQueryParamsApi,
			applySort,

			// Submissions
			submissions,
			submissionsPagination,
			isSubmissionsLoading,
			fetchSubmissions,
			setCurrentPage,
			handleAction,

			// Modals
			selectedSubmission,

			// Summary submission Modal
			openSummaryModal,

			// Filters Modal
			isModalOpenedFilters,
			openFiltersModal,

			// expose useEditorialLogic methods
			getEditorialActivityForEditorialDashboard,
			getEditorialActivityForMySubmissions,
			getEditorialActivityForMyReviewAssignments,

			getReviewActivityIndicatorProps,
			getReviewActivityIndicatorPopoverProps,

			_workflowActionFns,
		};
	},
);
