import {useSubmission} from '@/composables/useSubmission.js';
import {useLocalize} from '@/composables/useLocalize';
import {useDate} from '@/composables/useDate';
import {useReviewAssignment} from '@/composables/useReviewAssignment';
const DashboardPageTypes = {
	EDITORIAL_DASHBOARD: 'editorialDashboard',
	MY_REVIEW_ASSIGNMENTS: 'myReviewAssignments',
	MY_SUBMISSIONS: 'mySubmissions',
};

const {getActiveStage, getCurrentReviewRound} = useSubmission();
const {InProgressReviewAssignmentStatuses} = useReviewAssignment();
const {calculateDaysBetweenDates, formatShortDate} = useDate();

const {localizeSubmission, t} = useLocalize();

export function useSummaryConfig() {
	function filterItemsBasedOnContext(
		items,
		dashboardPage,
		submission,
		reviewAssignment = null,
	) {
		const activeStage = getActiveStage(submission);
		const activeReviewRound = getCurrentReviewRound(submission);
		return items
			.filter((item) => {
				if (item?.filters?.dashboardPage) {
					return item?.filters?.dashboardPage.includes(dashboardPage);
				}

				return true;
			})
			.filter((item) => {
				if (item?.filters?.activeStageId) {
					return item?.filters?.activeStageId.includes(activeStage.id);
				}

				return true;
			})
			.filter((item) => {
				if (item?.filters?.productionStageSubmissionStatusId) {
					return (
						activeStage.id === pkp.const.WORKFLOW_STAGE_ID_PRODUCTION &&
						item?.filters?.productionStageSubmissionStatusId.includes(
							submission.status,
						)
					);
				}

				return true;
			})
			.filter((item) => {
				if (item?.filters?.activeRoundStatusId) {
					return item?.filters?.activeRoundStatusId.includes(
						activeReviewRound.statusId,
					);
				}

				return true;
			})
			.filter((item) => {
				if (item?.filters?.reviewAssignmentStatusId && reviewAssignment) {
					return item?.filters?.reviewAssignmentStatusId.includes(
						reviewAssignment.statusId,
					);
				}
				return true;
			})
			.map((item) => {
				return item;
			});
	}

	function getPrimaryItems(submission, currentPublication) {
		const activeReviewRound = getCurrentReviewRound(submission);

		return [
			{
				component: 'LastActivity',
				props: {},
				filters: {
					dashboardPage: [DashboardPageTypes.EDITORIAL_DASHBOARD],
					activeStageId: [
						pkp.const.WORKFLOW_STAGE_ID_SUBMISSION,
						pkp.const.WORKFLOW_STAGE_ID_EXTERNAL_REVIEW,
						pkp.const.WORKFLOW_STAGE_ID_EDITING,
						pkp.const.WORKFLOW_STAGE_ID_PRODUCTION,
					],
				},
			},
			{
				component: 'PrimaryBasicMetadata',
				props: {
					heading: t('common.subtitle'),
					body: localizeSubmission(
						currentPublication.subtitle,
						currentPublication.locale,
					),
				},
				filters: {
					dashboardPage: [DashboardPageTypes.EDITORIAL_DASHBOARD],
					activeStageId: [pkp.const.WORKFLOW_STAGE_ID_PRODUCTION],
					productionStageSubmissionStatusId: [
						pkp.const.STATUS_SCHEDULED,
						pkp.const.STATUS_PUBLISHED,
					],
				},
			},
			{
				component: 'PrimaryBasicMetadata',
				props: {
					heading: t('metadata.property.displayName.doi'),
					body: currentPublication?.doiObject?.doi,
				},
				filters: {
					dashboardPage: [DashboardPageTypes.EDITORIAL_DASHBOARD],
					activeStageId: [pkp.const.WORKFLOW_STAGE_ID_PRODUCTION],
					productionStageSubmissionStatusId: [
						pkp.const.STATUS_SCHEDULED,
						pkp.const.STATUS_PUBLISHED,
					],
				},
			},

			{
				component: 'ContributorManager',
				props: {
					title: t('publication.contributors'),
					submissionId: submission.id,
					publicationId: currentPublication?.id,
				},
				filters: {
					dashboardPage: [DashboardPageTypes.EDITORIAL_DASHBOARD],
					activeStageId: [pkp.const.WORKFLOW_STAGE_ID_PRODUCTION],
					productionStageSubmissionStatusId: [
						pkp.const.STATUS_SCHEDULED,
						pkp.const.STATUS_PUBLISHED,
					],
				},
			},
			{
				component: 'FileManager',
				props: {
					configName: 'SUBMISSION_FILES',
					submission: submission,
					submissionStageId: submission.stageId,
				},
				filters: {
					dashboardPage: [
						DashboardPageTypes.EDITORIAL_DASHBOARD,
						DashboardPageTypes.MY_SUBMISSIONS,
					],
					activeStageId: [pkp.const.WORKFLOW_STAGE_ID_SUBMISSION],
				},
			},

			{
				component: 'DiscussionManager',
				props: {submissionId: submission.id, stageId: submission.stageId},
				filters: {
					dashboardPage: [
						DashboardPageTypes.EDITORIAL_DASHBOARD,
						DashboardPageTypes.MY_SUBMISSIONS,
					],
					activeStageId: [pkp.const.WORKFLOW_STAGE_ID_SUBMISSION],
				},
			},

			{
				component: 'FileManager',
				props: {
					configName: 'WORKFLOW_REVIEW_REVISIONS',
					submission: submission,
					submissionStageId: submission.stageId,
					reviewRoundId: activeReviewRound?.id,
				},
				filters: {
					dashboardPage: [
						DashboardPageTypes.EDITORIAL_DASHBOARD,
						DashboardPageTypes.MY_SUBMISSIONS,
					],
					activeStageId: [pkp.const.WORKFLOW_STAGE_ID_EXTERNAL_REVIEW],
				},
			},
			{
				component: 'FileManager',
				props: {
					configName: 'EDITOR_REVIEW_FILES',
					submission: submission,
					submissionStageId: submission.stageId,
					reviewRoundId: activeReviewRound?.id,
				},
				filters: {
					dashboardPage: [
						DashboardPageTypes.EDITORIAL_DASHBOARD,
						// TODO disabled for now as API is not authorising
						//DashboardPageTypes.MY_REVIEW_ASSIGNMENTS,
					],
					activeStageId: [pkp.const.WORKFLOW_STAGE_ID_EXTERNAL_REVIEW],
				},
			},
			{
				component: 'FileManager',
				props: {
					configName: 'COPYEDITED_FILES',
					submission: submission,
					submissionStageId: submission.stageId,
				},
				filters: {
					dashboardPage: [
						DashboardPageTypes.EDITORIAL_DASHBOARD,
						DashboardPageTypes.MY_SUBMISSIONS,
					],
					activeStageId: [pkp.const.WORKFLOW_STAGE_ID_EDITING],
				},
			},
			{
				component: 'FileManager',
				props: {
					configName: 'FINAL_DRAFT_FILES',
					submission: submission,
					submissionStageId: submission.stageId,
				},
				filters: {
					dashboardPage: [DashboardPageTypes.EDITORIAL_DASHBOARD],
					activeStageId: [pkp.const.WORKFLOW_STAGE_ID_EDITING],
				},
			},
			{
				component: 'FileManager',
				props: {
					configName: 'PRODUCTION_READY_FILES',
					submission: submission,
					submissionStageId: submission.stageId,
				},
				filters: {
					dashboardPage: [DashboardPageTypes.EDITORIAL_DASHBOARD],
					activeStageId: [pkp.const.WORKFLOW_STAGE_ID_PRODUCTION],
					productionStageSubmissionStatusId: [pkp.const.STATUS_QUEUED],
				},
			},
			{
				component: 'FileManager',
				props: {
					namespace: 'galleys',
					submissionId: submission.id,
					submissionStageId: submission.stageId,

					fileStages: [pkp.const.SUBMISSION_FILE_PROOF],
					title: t('dashboard.summary.galleys'),
				},
				filters: {
					dashboardPage: [DashboardPageTypes.EDITORIAL_DASHBOARD],
					activeStageId: [pkp.const.WORKFLOW_STAGE_ID_PRODUCTION],
					productionStageSubmissionStatusId: [
						pkp.const.STATUS_SCHEDULED,
						pkp.const.STATUS_PUBLISHED,
					],
				},
			},

			{
				component: 'ReviewerManager',
				props: {
					submission: submission,
				},
				filters: {
					dashboardPage: [DashboardPageTypes.EDITORIAL_DASHBOARD],
					activeStageId: [pkp.const.WORKFLOW_STAGE_ID_EXTERNAL_REVIEW],
				},
			},
			{
				component: 'ReviewerManager',
				props: {
					submission: submission,
					redactedForAuthors: true,
				},
				filters: {
					dashboardPage: [DashboardPageTypes.MY_SUBMISSIONS],
					activeStageId: [pkp.const.WORKFLOW_STAGE_ID_EXTERNAL_REVIEW],
				},
			},
		];
	}

	function getActionItems(submission, currentPublication) {
		return [
			{
				component: 'ActionButton',
				props: {
					label: t('dashboard.summary.uploadRevisions'),
					isSecondary: true,
					action: 'uploadRevisions',
				},
				filters: {
					dashboardPage: [DashboardPageTypes.MY_SUBMISSIONS],
					activeStageId: [pkp.const.WORKFLOW_STAGE_ID_EXTERNAL_REVIEW],
					activeRoundStatusId: [
						pkp.const.REVIEW_ROUND_STATUS_REVISIONS_REQUESTED,
						pkp.const.REVIEW_ROUND_STATUS_RESUBMIT_FOR_REVIEW,
						// Keep it available also after submitted (following logic from workflow page)
						pkp.const.REVIEW_ROUND_STATUS_REVISIONS_SUBMITTED,
						pkp.const.REVIEW_ROUND_STATUS_RESUBMIT_FOR_REVIEW_SUBMITTED,
					],
				},
			},
			//
			{
				component: 'ActionButton',
				props: {
					label: t('dashboard.summary.sendSubmissionForReview'),
					isPrimary: true,
					action: 'decisionExternalReview',
				},
				filters: {
					dashboardPage: [DashboardPageTypes.EDITORIAL_DASHBOARD],
					activeStageId: [pkp.const.WORKFLOW_STAGE_ID_SUBMISSION],
				},
			},
			{
				component: 'ActionButton',
				props: {
					label: t('dashboard.summary.acceptAndSkipReview'),
					isSecondary: true,
					action: 'decisionSkipExternalReview',
				},
				filters: {
					dashboardPage: [DashboardPageTypes.EDITORIAL_DASHBOARD],
					activeStageId: [pkp.const.WORKFLOW_STAGE_ID_SUBMISSION],
				},
			},
			{
				component: 'ActionButton',
				props: {
					label: t('dashboard.summary.declineSubmission'),
					isWarnable: true,
					action: 'decisionInitialDecline',
				},
				filters: {
					dashboardPage: [DashboardPageTypes.EDITORIAL_DASHBOARD],
					activeStageId: [pkp.const.WORKFLOW_STAGE_ID_SUBMISSION],
				},
			},

			//
			{
				component: 'ActionButton',
				props: {
					label: t('dashboard.summary.requestRevisions'),
					isSecondary: true,
					action: 'requestRevisions',
				},
				filters: {
					dashboardPage: [DashboardPageTypes.EDITORIAL_DASHBOARD],
					activeStageId: [pkp.const.WORKFLOW_STAGE_ID_EXTERNAL_REVIEW],
				},
			},
			{
				component: 'ActionButton',
				props: {
					label: t('dashboard.summary.acceptSubmission'),
					action: 'decisionAccept',
					isPrimary: true,
				},
				filters: {
					dashboardPage: [DashboardPageTypes.EDITORIAL_DASHBOARD],
					activeStageId: [pkp.const.WORKFLOW_STAGE_ID_EXTERNAL_REVIEW],
				},
			},
			{
				component: 'ActionButton',
				props: {
					label: t('dashboard.summary.cancelReviewRound'),
					isWarnable: true,
					action: 'decisionCancelReviewRound',
				},
				filters: {
					dashboardPage: [DashboardPageTypes.EDITORIAL_DASHBOARD],
					activeStageId: [pkp.const.WORKFLOW_STAGE_ID_EXTERNAL_REVIEW],
				},
			},
			{
				component: 'ActionButton',
				props: {
					label: t('dashboard.summary.declineSubmission'),
					isWarnable: true,
					action: 'decisionDecline',
				},
				filters: {
					dashboardPage: [DashboardPageTypes.EDITORIAL_DASHBOARD],
					activeStageId: [pkp.const.WORKFLOW_STAGE_ID_EXTERNAL_REVIEW],
				},
			},
			{
				component: 'ActionButton',
				props: {
					label: t('dashboard.summary.acceptReview'),
					isPrimary: true,
					action: 'openReviewForm',
				},
				filters: {
					dashboardPage: [DashboardPageTypes.MY_REVIEW_ASSIGNMENTS],
					activeStageId: [pkp.const.WORKFLOW_STAGE_ID_EXTERNAL_REVIEW],
					reviewAssignmentStatusId: [
						pkp.const.REVIEW_ASSIGNMENT_STATUS_AWAITING_RESPONSE,
						pkp.const.REVIEW_ASSIGNMENT_STATUS_RESPONSE_OVERDUE,
						pkp.const.REVIEW_ASSIGNMENT_STATUS_REVIEW_OVERDUE,
						pkp.const.REVIEW_ASSIGNMENT_STATUS_REQUEST_RESEND,
					],
				},
			},
			{
				component: 'ActionButton',
				props: {
					label: t('dashboard.summary.accessReviewForm'),
					isPrimary: true,
					action: 'openReviewForm',
				},
				filters: {
					dashboardPage: [DashboardPageTypes.MY_REVIEW_ASSIGNMENTS],
					activeStageId: [pkp.const.WORKFLOW_STAGE_ID_EXTERNAL_REVIEW],
					reviewAssignmentStatusId: [
						pkp.const.REVIEW_ASSIGNMENT_STATUS_ACCEPTED,
					],
				},
			},
			{
				component: 'ActionButton',
				props: {
					label: t('dashboard.summary.uploadFile'),
					isSecondary: true,
					action: 'uploadReviewerFile',
				},
				filters: {
					dashboardPage: [DashboardPageTypes.MY_REVIEW_ASSIGNMENTS],
					activeStageId: [pkp.const.WORKFLOW_STAGE_ID_EXTERNAL_REVIEW],
					reviewAssignmentStatusId: [...InProgressReviewAssignmentStatuses],
				},
			},
			{
				component: 'ActionButton',
				props: {
					label: t('dashboard.summary.decline'),
					isSecondary: true,
					action: 'declineReviewAssignment',
				},
				filters: {
					dashboardPage: [DashboardPageTypes.MY_REVIEW_ASSIGNMENTS],
					activeStageId: [pkp.const.WORKFLOW_STAGE_ID_EXTERNAL_REVIEW],
					reviewAssignmentStatusId: [
						pkp.const.REVIEW_ASSIGNMENT_STATUS_AWAITING_RESPONSE,
						// TODO: can be declined after resend?
						pkp.const.REVIEW_ASSIGNMENT_STATUS_REQUEST_RESEND,
					],
				},
			},
			{
				component: 'ActionButton',
				props: {
					label: t('dashboard.summary.sendToProduction'),
					isPrimary: true,
					action: 'decisionSendToProduction',
				},
				filters: {
					dashboardPage: [DashboardPageTypes.EDITORIAL_DASHBOARD],
					activeStageId: [pkp.const.WORKFLOW_STAGE_ID_EDITING],
				},
			},
			{
				component: 'ActionButton',
				props: {
					label: t('dashboard.summary.scheduleForProduction'),
					isPrimary: true,
					action: 'scheduleForPublication',
				},
				filters: {
					dashboardPage: [DashboardPageTypes.EDITORIAL_DASHBOARD],
					activeStageId: [pkp.const.WORKFLOW_STAGE_ID_PRODUCTION],
					productionStageSubmissionStatusId: [pkp.const.STATUS_QUEUED],
				},
			},
			{
				component: 'ActionButton',
				props: {
					label: t('dashboard.summary.preview'),
					isSecondary: true,
					action: 'previewPublication',
				},
				filters: {
					dashboardPage: [DashboardPageTypes.EDITORIAL_DASHBOARD],
					activeStageId: [pkp.const.WORKFLOW_STAGE_ID_PRODUCTION],
					productionStageSubmissionStatusId: [pkp.const.STATUS_SCHEDULED],
				},
			},
			{
				component: 'ActionButton',
				props: {
					label: t('dashboard.summary.unschedule'),
					isWarnable: true,
					action: 'unschedulePublication',
				},
				filters: {
					dashboardPage: [DashboardPageTypes.EDITORIAL_DASHBOARD],
					activeStageId: [pkp.const.WORKFLOW_STAGE_ID_PRODUCTION],
					productionStageSubmissionStatusId: [pkp.const.STATUS_SCHEDULED],
				},
			},
		];
	}
	function getMetaItems(submission, currentPublication) {
		return [
			{
				component: 'ParticipantManager',
				props: {
					submission,
					submissionStageId: submission.stageId,
				},
				filters: {
					dashboardPage: [DashboardPageTypes.EDITORIAL_DASHBOARD],
					activeStageId: [
						pkp.const.WORKFLOW_STAGE_ID_SUBMISSION,
						pkp.const.WORKFLOW_STAGE_ID_EXTERNAL_REVIEW,
						pkp.const.WORKFLOW_STAGE_ID_EDITING,
						pkp.const.WORKFLOW_STAGE_ID_PRODUCTION,
					],
				},
			},
			{
				component: 'BasicMetadata',
				props: {
					heading: t('dashboard.summary.submittedOn'),
					body: formatShortDate(submission.dateSubmitted),
				},
				filters: {
					dashboardPage: [DashboardPageTypes.MY_SUBMISSIONS],
					activeStageId: [
						pkp.const.WORKFLOW_STAGE_ID_SUBMISSION,
						pkp.const.WORKFLOW_STAGE_ID_EXTERNAL_REVIEW,
						pkp.const.WORKFLOW_STAGE_ID_EDITING,
						pkp.const.WORKFLOW_STAGE_ID_PRODUCTION,
					],
				},
			},
			{
				component: 'BasicMetadata',
				props: {
					heading: t('dashboard.summary.daysSinceSubmission'),
					body: calculateDaysBetweenDates(submission.dateSubmitted, new Date()),
				},
				filters: {
					dashboardPage: [DashboardPageTypes.EDITORIAL_DASHBOARD],
					activeStageId: [
						pkp.const.WORKFLOW_STAGE_ID_SUBMISSION,
						pkp.const.WORKFLOW_STAGE_ID_EXTERNAL_REVIEW,
						pkp.const.WORKFLOW_STAGE_ID_EDITING,
						pkp.const.WORKFLOW_STAGE_ID_PRODUCTION,
					],
				},
			},
			{
				component: 'BasicMetadata',
				props: {
					heading: t('dashboard.summary.daysInSubmission'),
					body: '(todo)',
				},
				filters: {
					dashboardPage: [DashboardPageTypes.EDITORIAL_DASHBOARD],
					activeStageId: [pkp.const.WORKFLOW_STAGE_ID_SUBMISSION],
				},
			},
			{
				component: 'BasicMetadata',
				props: {
					heading: t('dashboard.summary.daysInReview'),
					body: '(todo)',
				},
				filters: {
					dashboardPage: [DashboardPageTypes.EDITORIAL_DASHBOARD],
					activeStageId: [pkp.const.WORKFLOW_STAGE_ID_EXTERNAL_REVIEW],
				},
			},
			{
				component: 'BasicMetadata',
				props: {
					heading: t('dashboard.summary.daysInCopyediting'),
					body: '(todo)',
				},
				filters: {
					dashboardPage: [DashboardPageTypes.EDITORIAL_DASHBOARD],
					activeStageId: [pkp.const.WORKFLOW_STAGE_ID_EDITING],
				},
			},
			{
				component: 'BasicMetadata',
				props: {
					heading: t('dashboard.summary.daysInProduction'),
					body: '(todo)',
				},
				filters: {
					dashboardPage: [DashboardPageTypes.EDITORIAL_DASHBOARD],
					activeStageId: [pkp.const.WORKFLOW_STAGE_ID_PRODUCTION],
					productionStageSubmissionStatusId: [pkp.const.STATUS_QUEUED],
				},
			},

			{
				component: 'BasicMetadata',
				props: {
					heading: t('dashboard.summary.journalName'),
					body: '(todo)',
				},
				filters: {
					dashboardPage: [DashboardPageTypes.MY_SUBMISSIONS],
					activeStageId: [
						pkp.const.WORKFLOW_STAGE_ID_SUBMISSION,
						pkp.const.WORKFLOW_STAGE_ID_EXTERNAL_REVIEW,
						pkp.const.WORKFLOW_STAGE_ID_EDITING,
						pkp.const.WORKFLOW_STAGE_ID_PRODUCTION,
					],
				},
			},
			{
				component: 'IssueAssigned',
				props: {isReadonly: false},
				filters: {
					dashboardPage: [DashboardPageTypes.EDITORIAL_DASHBOARD],
					activeStageId: [
						pkp.const.WORKFLOW_STAGE_ID_SUBMISSION,
						pkp.const.WORKFLOW_STAGE_ID_EXTERNAL_REVIEW,
						pkp.const.WORKFLOW_STAGE_ID_EDITING,
						pkp.const.WORKFLOW_STAGE_ID_PRODUCTION,
					],
				},
			},
			{
				component: 'IssueAssigned',
				props: {isReadOnly: true},
				filters: {
					dashboardPage: [DashboardPageTypes.MY_SUBMISSIONS],
					activeStageId: [
						pkp.const.WORKFLOW_STAGE_ID_SUBMISSION,
						pkp.const.WORKFLOW_STAGE_ID_EXTERNAL_REVIEW,
						pkp.const.WORKFLOW_STAGE_ID_EDITING,
						pkp.const.WORKFLOW_STAGE_ID_PRODUCTION,
					],
				},
			},

			{
				component: 'BasicMetadata',
				props: {
					heading: t('common.type'),
					body: '(todo)',
				},
				filters: {
					dashboardPage: [
						DashboardPageTypes.EDITORIAL_DASHBOARD,
						DashboardPageTypes.MY_SUBMISSIONS,
					],
					activeStageId: [
						pkp.const.WORKFLOW_STAGE_ID_SUBMISSION,
						pkp.const.WORKFLOW_STAGE_ID_EXTERNAL_REVIEW,
						pkp.const.WORKFLOW_STAGE_ID_EDITING,
						pkp.const.WORKFLOW_STAGE_ID_PRODUCTION,
					],
				},
			},

			{
				component: 'BasicMetadata',
				props: {
					heading: t('common.abstract'),
					body: localizeSubmission(
						currentPublication?.abstract,
						currentPublication?.locale,
					),
				},
				filters: {
					dashboardPage: [
						DashboardPageTypes.EDITORIAL_DASHBOARD,
						DashboardPageTypes.MY_SUBMISSIONS,
						DashboardPageTypes.MY_REVIEW_ASSIGNMENTS,
					],
					activeStageId: [
						pkp.const.WORKFLOW_STAGE_ID_SUBMISSION,
						pkp.const.WORKFLOW_STAGE_ID_EXTERNAL_REVIEW,
						pkp.const.WORKFLOW_STAGE_ID_EDITING,
						pkp.const.WORKFLOW_STAGE_ID_PRODUCTION,
					],
				},
			},
			{
				component: 'BasicMetadata',
				props: {
					heading: t('common.keywords'),
					body:
						currentPublication?.keywords &&
						localizeSubmission(
							currentPublication?.keywords,
							currentPublication?.locale,
						).join(', '),
				},
				filters: {
					dashboardPage: [
						DashboardPageTypes.EDITORIAL_DASHBOARD,
						DashboardPageTypes.MY_SUBMISSIONS,
						DashboardPageTypes.MY_REVIEW_ASSIGNMENTS,
					],
					activeStageId: [
						pkp.const.WORKFLOW_STAGE_ID_SUBMISSION,
						pkp.const.WORKFLOW_STAGE_ID_EXTERNAL_REVIEW,
						pkp.const.WORKFLOW_STAGE_ID_EDITING,
						pkp.const.WORKFLOW_STAGE_ID_PRODUCTION,
					],
				},
			},
			{
				component: 'BasicMetadata',
				props: {
					heading: t('dashboard.summary.submissionLanguage'),
					body: `${currentPublication?.locale} (todo show language name not locale)`,
				},
				filters: {
					dashboardPage: [
						DashboardPageTypes.EDITORIAL_DASHBOARD,
						DashboardPageTypes.MY_SUBMISSIONS,
						DashboardPageTypes.MY_REVIEW_ASSIGNMENTS,
					],
					activeStageId: [
						pkp.const.WORKFLOW_STAGE_ID_SUBMISSION,
						pkp.const.WORKFLOW_STAGE_ID_EXTERNAL_REVIEW,
						pkp.const.WORKFLOW_STAGE_ID_EDITING,
						pkp.const.WORKFLOW_STAGE_ID_PRODUCTION,
					],
				},
			},
		];
	}

	return {
		filterItemsBasedOnContext,
		getPrimaryItems,
		getActionItems,
		getMetaItems,
	};
}
