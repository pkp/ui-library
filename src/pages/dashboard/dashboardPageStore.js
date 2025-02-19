import {computed, ref, watch} from 'vue';

import {useFetchPaginated} from '@/composables/useFetchPaginated';
import {useFiltersForm} from '@/composables/useFiltersForm';
import {useSorting} from '@/composables/useSorting';
import {useLocalize} from '@/composables/useLocalize';
import {useModal} from '@/composables/useModal';
import {useAnnouncer} from '@/composables/useAnnouncer';
import {useUrl} from '@/composables/useUrl';
import {useQueryParams} from '@/composables/useQueryParams';
import {defineComponentStore} from '@/utils/defineComponentStore';

import {useWorkflowActions} from '../workflow/composables/useWorkflowActions';
import {useReviewerManagerActions} from '@/managers/ReviewerManager/useReviewerManagerActions';
import {useDashboardBulkDelete} from './composables/useDashboardBulkDelete';
import {useParticipantManagerActions} from '@/managers/ParticipantManager/useParticipantManagerActions';
import {useFileManagerActions} from '@/managers/FileManager/useFileManagerActions';

import {useEditorialLogic} from './composables/useEditorialLogic';
import {useReviewActivityLogic} from './composables/useReviewActivityLogic';
import {useSubmission} from '@/composables/useSubmission';

import DashboardModalFilters from '@/pages/dashboard/modals/DashboardModalFilters.vue';

const {t, tk} = useLocalize();

const TitleTranslations = {
	editorialDashboard: tk('navigation.dashboards'),
	myReviewAssignments: tk('navigation.reviewAssignments'),
	mySubmissions: tk('navigation.mySubmissions'),
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
		const queryParamsUrl = useQueryParams();

		/**
		 * Views
		 */
		const views = ref(pageInitConfig.views);
		const currentViewId = computed(() => {
			// does it exist
			const view = views.value.find(
				(view) => view.id === queryParamsUrl.currentViewId,
			);
			if (view) {
				return queryParamsUrl.currentViewId;
			} else {
				// fallback to first available view
				queryParamsUrl.currentViewId = views.value[0].id;
				return views.value[0].id;
			}
		});

		// reset filters when the view gets changed from menu
		watch(
			() => queryParamsUrl.currentViewId,
			(newCurrentViewId, prevCurrentViewId) => {
				if (newCurrentViewId !== prevCurrentViewId) {
					currentPage.value = 1;
					clearFiltersForm();
					resetSearchPhrase();
				}
			},
		);

		const currentView = computed(
			() => views.value.find((view) => view.id === currentViewId.value) || {},
		);

		/**
		 * Columns
		 */
		const columns = ref(pageInitConfig.columns);

		/**
		 * Search Phrase
		 */
		const searchPhrase = computed(() => {
			return queryParamsUrl.searchPhrase || '';
		});
		function setSearchPhrase(value) {
			queryParamsUrl.searchPhrase = value;
			currentPage.value = 1;
		}
		function resetSearchPhrase() {
			queryParamsUrl.searchPhrase = undefined;
		}

		/**
		 * Filters Modal
		 */
		const isModalOpenedFilters = ref(false);
		function openFiltersModal() {
			openSideModal(DashboardModalFilters, {
				filtersFormInitial: filtersForm,
				onUpdateFiltersForm: updateFiltersForm,
			});
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

		watch(filtersFormQueryParams, (paramsToApply) => {
			Object.keys(paramsToApply).forEach((paramKey) => {
				if (
					JSON.stringify(queryParamsUrl[paramKey]) !==
					JSON.stringify(paramsToApply[paramKey])
				) {
					queryParamsUrl[paramKey] = paramsToApply[paramKey];
				}
			});
		});

		// Teoretically initFiltersFormFromQueryParams could be called only on the page load.
		// Motivation to use watch here is to keep using the url as source of the truth, to
		// catch bugs early, without testing all possible filters being loaded just from the url.
		watch(
			queryParamsUrl,
			(newQueryParamsUrl) => {
				initFiltersFormFromQueryParams(newQueryParamsUrl);
			},
			{immediate: true},
		);

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
			// to avoid multiple fetch calls while view changing watchers triggers query params recalculation
			debouncedMs: 2,
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

				await fetchSubmissions({clearData: true});
				announce(t('common.loaded'));
			},
			{immediate: true},
		);

		const _workflowActionFns = useWorkflowActions(pageInitConfig);
		const _reviewerManagerActionFns = useReviewerManagerActions(pageInitConfig);
		const _participantManagerActionsFns =
			useParticipantManagerActions(pageInitConfig);
		const _fileManagerActionFns = useFileManagerActions();
		const {getCurrentPublication} = useSubmission();

		function refetchCallback() {
			fetchSubmissions();
		}

		/**
		 * Bulk delete
		 */
		const {
			bulkDeleteIsAvailableForUser,

			bulkDeleteSelectionEnabled,
			bulkDeleteSelectionEnable,
			bulkDeleteSelectionDisable,

			bulkDeleteSelectedItems,
			bulkDeleteSelectItem,
			bulkDeleteDeselectItem,
			bulkDeleteSubmissionIdsCanBeDeleted,
			bulkDeleteActionDelete,

			bulkDeleteResetSelection,
		} = useDashboardBulkDelete({
			submissions,
			dashboardPage: pageInitConfig.dashboardPage,
			onSubmissionDeleteCallback: () => {
				fetchSubmissions();
			},
		});

		// reset selection when changing view/search/filters
		watch(submissionsQuery, () => {
			bulkDeleteResetSelection();
		});

		/**
		 * Reviewer actions,
		 * available for review assignments popup
		 */
		function openReviewerForm({submissionId}) {
			const {redirectToPage} = useUrl(
				`reviewer/submission/${encodeURIComponent(submissionId)}`,
				{},
			);

			redirectToPage();
		}

		function enrichActionArgs({submissionId, ...args}) {
			const submission = submissions.value.find(
				(submission) => submission.id === submissionId,
			);
			const selectedPublication = getCurrentPublication(submission);

			return {
				submissionStageId: submission.stageId,
				submission,
				submissionId,
				selectedPublication,
				...args,
			};
		}
		function reviewerAddReviewer({reviewRoundId, submissionId}) {
			_reviewerManagerActionFns.reviewerAddReviewer(
				enrichActionArgs({reviewRoundId, submissionId}),
				refetchCallback,
			);
		}

		function reviewerResendRequest({reviewAssignment, submissionId}) {
			_reviewerManagerActionFns.reviewerResendRequest(
				enrichActionArgs({reviewAssignment, submissionId}),
				refetchCallback,
			);
		}

		function reviewerEditReview({reviewAssignment, submissionId}) {
			_reviewerManagerActionFns.reviewerEditReview(
				enrichActionArgs({reviewAssignment, submissionId}),
				refetchCallback,
			);
		}

		function reviewerReviewDetails({reviewAssignment, submissionId}) {
			_reviewerManagerActionFns.reviewerReviewDetails(
				enrichActionArgs({reviewAssignment, submissionId}),
				refetchCallback,
			);
		}

		function reviewerCancelReviewer({reviewAssignment, submissionId}) {
			_reviewerManagerActionFns.reviewerCancelReviewer(
				enrichActionArgs({reviewAssignment, submissionId}),
				refetchCallback,
			);
		}

		function reviewerUnassignReviewer({reviewAssignment, submissionId}) {
			_reviewerManagerActionFns.reviewerUnassignReviewer(
				enrichActionArgs({reviewAssignment, submissionId}),
				refetchCallback,
			);
		}

		/**
		 * File Manager actions
		 */
		function fileUpload(args) {
			_fileManagerActionFns.fileUpload(enrichActionArgs(args), refetchCallback);
		}

		/**
		 * Participants Actions
		 *
		 * */
		function participantAssign({submissionId}) {
			_participantManagerActionsFns.participantAssign(
				enrichActionArgs({submissionId}),
				refetchCallback,
			);
		}

		/**
		 * Modals
		 */
		const selectedSubmission = ref(null);

		/**
		 * Workflow submission Modal
		 */

		// Tracking which submissionId is opened in workflow modal for query params
		const workflowSubmissionId = computed(() => {
			return queryParamsUrl.workflowSubmissionId;
		});

		function openWorkflowModal(submissionId) {
			queryParamsUrl.workflowSubmissionId = submissionId;
			openSideModal(
				'WorkflowPage',
				{
					submissionId,
					pageInitConfig,
				},
				{
					onClose: async () => {
						queryParamsUrl.workflowSubmissionId = null;
						queryParamsUrl.workflowMenuKey = null;
						await fetchSubmissions();
					},
				},
			);
		}
		if (queryParamsUrl.workflowSubmissionId) {
			openWorkflowModal(queryParamsUrl.workflowSubmissionId);
		}

		function openSubmissionWizard({submissionId}) {
			const {redirectToPage} = useUrl(`submission?id=${submissionId}`);
			redirectToPage();
		}

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

			// Bulk delete
			bulkDeleteIsAvailableForUser,

			bulkDeleteSelectionEnabled,
			bulkDeleteSelectionEnable,
			bulkDeleteSelectionDisable,

			bulkDeleteSelectedItems,
			bulkDeleteSelectItem,
			bulkDeleteDeselectItem,
			bulkDeleteSubmissionIdsCanBeDeleted,
			bulkDeleteActionDelete,

			// Workflow Page
			workflowSubmissionId,

			// Reviewer listing
			openReviewerForm,

			// File manager actions
			fileUpload,

			// Reviewer manager actions
			reviewerAddReviewer,
			reviewerReviewDetails,
			reviewerResendRequest,
			reviewerEditReview,
			reviewerCancelReviewer,
			reviewerUnassignReviewer,

			// Participant manager actions
			participantAssign,

			// Modals
			selectedSubmission,

			// Workflow Modal
			openWorkflowModal,

			openSubmissionWizard,

			// Filters Modal
			isModalOpenedFilters,
			openFiltersModal,

			// expose useEditorialLogic methods
			getEditorialActivityForEditorialDashboard,
			getEditorialActivityForMySubmissions,
			getEditorialActivityForMyReviewAssignments,

			getReviewActivityIndicatorProps,
			getReviewActivityIndicatorPopoverProps,

			// Expose component forms, so managers and other dashboard/workflow component can access them
			componentForms: pageInitConfig.componentForms,
			_workflowActionFns,
		};
	},
);
