import {computed, ref, watch} from 'vue';

import {useFetchPaginated} from '@/composables/useFetchPaginated';
import {useFiltersForm} from '@/composables/useFiltersForm';
import {useSorting} from '@/composables/useSorting';
import {useLocalize} from '@/composables/useLocalize';
import {useModal} from '@/composables/useModal';
import {useAnnouncer} from '@/composables/useAnnouncer';
import {useUrl} from '@/composables/useUrl';
import {useForm} from '@/composables/useForm';

import {useUrlSearchParams} from '@vueuse/core';
import {defineComponentStore} from '@/utils/defineComponentStore';

import {useEditorialLogic} from './useEditorialLogic';

import {useSubmission} from './useSubmission';

import SubmissionsFiltersModal from '@/pages/submissions/SubmissionsFiltersModal.vue';
import SubmissionSummaryModal from '@/pages/submissions/SubmissionSummaryModal.vue';
import SelectRevisionRecommendationFormModal from './SelectRevisionRecommendationFormModal.vue';
// TODO add actual translation strings
const TitleTranslations = {
	EDITORIAL_DASHBOARD: 'Dashboards',
	MY_REVIEW_ASSIGNMENTS: 'Review Assignments',
	MY_SUBMISSIONS: 'My Submissions',
};

const TitleIcons = {
	EDITORIAL_DASHBOARD: 'Dashboard',
	MY_REVIEW_ASSIGNMENTS: 'ReviewAssignments',
	MY_SUBMISSIONS: 'MySubmissions',
};

export const useSubmissionsPageStore = defineComponentStore(
	'submissionsPage',
	(pageInitConfig) => {
		/**
		 * ModalStore
		 */
		const {openSideModal} = useModal();

		/**
		 * Translation
		 */

		const {t, localize} = useLocalize();

		/** Announcer */

		const {announce} = useAnnouncer();

		/** Dashboard Page */

		const dashboardPageTitle = computed(() => {
			return TitleTranslations[pageInitConfig.dashboardPage];
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

		function handleItemAction(actionName, actionArgs) {
			console.log('handleItemAction', actionName, actionArgs);

			const editorialDecisionActions = {
				requestRevisions: {},
				acceptSubmission: {
					decisionId: pkp.const.DECISION_ACCEPT,
				},
				cancelReviewRound: {
					decisionId: pkp.const.DECISION_CANCEL_REVIEW_ROUND,
				},
				declineSubmission: {
					decisionId: pkp.const.DECISION_DECLINE,
				},
			};

			function openDecisionPage(submissionId, decisionId) {
				const submission = submissions.value.find(
					(submission) => submission.id === actionArgs.submissionId,
				);
				const {getActiveReviewRound} = useSubmission();
				const activeReviewRound = getActiveReviewRound(submission);

				const currentPageUrl = `dashboard/editorial?${new URLSearchParams({...queryParamsUrl, summarySubmissionId: submissionId}).toString()}`;

				const {redirectToPage} = useUrl(
					`decision/record/${encodeURIComponent(actionArgs.submissionId)}`,
					{
						reviewRoundId: activeReviewRound.id,
						decision: decisionId,
						ret: currentPageUrl,
					},
				);

				redirectToPage();
			}

			const submission = submissions.value.find(
				(submission) => submission.id === actionArgs.submissionId,
			);

			if (editorialDecisionActions[actionName]) {
				const {submissionId} = actionArgs;
				if (actionName === 'requestRevisions') {
					// open modal
					const {set, form, getValue} = useForm(
						pageInitConfig.selectRevisionDecisionForm,
					);
					openSideModal(SelectRevisionRecommendationFormModal, {
						formProps: form,
						onSet: set,
						onSuccess: () => {
							const decision = getValue('decision');
							console.log('decision:', decision);
							openDecisionPage(submissionId, decision);
						},
					});

					return;
				}

				const editorialDecisionAction = editorialDecisionActions[actionName];

				openDecisionPage(submissionId, editorialDecisionAction.decisionId);

				// redirect to decisions page
			}

			if (actionName === 'assignReviewers') {
				const {getActiveReviewRound} = useSubmission();

				const activeReviewRound = getActiveReviewRound(submission);

				const url = pageInitConfig.addReviewerUrl
					.replace('__id__', submission.id)
					.replace('__stageId__', submission.stageId)
					.replace('__reviewRoundId__', activeReviewRound.id);

				openSideModal(
					'LegacyAjax',
					{
						options: {title: t('editor.submission.addStageParticipant'), url},
					},
					{
						onClose: async () => {
							await fetchSubmissions();
						},
					},
				);
			} else if (['unassignReviewer', 'cancelReviewer'].includes(actionName)) {
				const url = pageInitConfig.unassignReviewerUrl
					.replace('__id__', submission.id)
					.replace('__stageId__', submission.stageId)
					.replace('__reviewAssignmentId__', actionArgs.reviewAssignmentId);

				const modalTitle =
					actionName === 'unassignReviewer'
						? t('editor.review.unassignReviewer')
						: t('editor.review.cancelReviewer');

				openSideModal(
					'LegacyAjax',
					{
						options: {title: modalTitle, url},
					},
					{
						onClose: async () => {
							await fetchSubmissions();
						},
					},
				);
			} else if (actionName === 'resendReviewRequest') {
				const url = pageInitConfig.resendRequestReviewerUrl
					.replace('__id__', submission.id)
					.replace('__stageId__', submission.stageId)
					.replace('__reviewAssignmentId__', actionArgs.reviewAssignmentId);

				openSideModal(
					'LegacyAjax',
					{
						options: {title: t('editor.review.resendRequestReviewer'), url},
					},
					{
						onClose: async () => {
							await fetchSubmissions();
						},
					},
				);
			} else if (
				[
					'viewDetails',
					'viewUnreadRecommendation',
					'viewRecommendation',
				].includes(actionName)
			) {
				const url = pageInitConfig.reviewDetailsUrl
					.replace('__id__', submission.id)
					.replace('__stageId__', submission.stageId)
					.replace('__reviewAssignmentId__', actionArgs.reviewAssignmentId);

				const {getCurrentPublication} = useSubmission();

				openSideModal(
					'LegacyAjax',
					{
						options: {
							title: `${t('editor.review.reviewDetails')}: ${localize(getCurrentPublication(submission).fullTitle)}`,
							url,
						},
					},
					{
						onClose: async () => {
							await fetchSubmissions();
						},
					},
				);
			} else if (actionName === 'editDueDate') {
				const url = pageInitConfig.editReviewUrl
					.replace('__id__', submission.id)
					.replace('__stageId__', submission.stageId)
					.replace('__reviewAssignmentId__', actionArgs.reviewAssignmentId);

				openSideModal(
					'LegacyAjax',
					{
						options: {title: t('editor.submissionReview.editReview'), url},
					},
					{
						onClose: async () => {
							await fetchSubmissions();
						},
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
		function openSummaryModal(submissionId) {
			openSideModal(
				SubmissionSummaryModal,
				{
					submissionId,
				},
				{
					onClose: async () => {
						await fetchSubmissions();
					},
				},
			);
		}
		if (queryParamsUrl.summarySubmissionId) {
			openSummaryModal(queryParamsUrl.summarySubmissionId);
			queryParamsUrl.summarySubmissionId = undefined;
		}

		/**
		 * Filters Modal
		 */
		const isModalOpenedFilters = ref(false);
		function openFiltersModal() {
			openSideModal(SubmissionsFiltersModal, {
				filtersFormInitial: filtersForm,
				onUpdateFiltersForm: updateFiltersForm,
			});
		}

		/**
		 * Assign Participant Modal
		 */
		const assignParticipantUrl = ref(pageInitConfig.assignParticipantUrl);
		const isModalOpenedAssignParticipant = ref(false);

		function openAssignParticipantModal(submission) {
			const url = assignParticipantUrl.value
				.replace('__id__', submission.id)
				.replace('__stageId__', submission.stageId);

			openSideModal('LegacyAjax', {
				options: {url},
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
		const {getEditorialActivityForEditorConfig} = useEditorialLogic();

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
			handleItemAction,

			// Modals
			selectedSubmission,

			// Summary submission Modal
			openSummaryModal,

			// Filters Modal
			isModalOpenedFilters,
			openFiltersModal,

			// AssignParticipant Modal
			assignParticipantUrl,
			isModalOpenedAssignParticipant,
			openAssignParticipantModal,

			// expose useEditorialLogic methods
			getEditorialActivityForEditorConfig,
		};
	},
);
