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

const {localizeSubmission} = useLocalize();

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
					heading: 'Subtitle (t)',
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
					heading: 'DOI (t)',
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
					title: 'Contributors (t)',
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
					namespace: 'deskReviewFiles',

					submissionId: submission.id,
					fileStages: [pkp.const.SUBMISSION_FILE_SUBMISSION],
					title: 'Desk Review Files (t)',
					description:
						'These are the files that will be taken forward to the review stage in the workflow (t).',
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
				component: 'FileManager',
				props: {
					namespace: 'filesRevisions',
					submissionId: submission.id,
					reviewRoundId: activeReviewRound?.id,
					fileStages: [pkp.const.SUBMISSION_FILE_REVIEW_REVISION],
					title: 'Revisions Submitted (localize)',
					description:
						'These files have been submitted by the author after visions were requested (localize)',
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
					namespace: 'filesForReview',
					submissionId: submission.id,
					reviewRoundId: activeReviewRound?.id,
					fileStages: [pkp.const.SUBMISSION_FILE_REVIEW_FILE],
					title: 'Files for review (localize)',
					description:
						'These files will be sent to the reviewers to review (localize)',
				},
				filters: {
					dashboardPage: [
						DashboardPageTypes.EDITORIAL_DASHBOARD,
						// TODO disabled for now as API is not authorising
						DashboardPageTypes.MY_REVIEW_ASSIGNMENTS,
					],
					activeStageId: [pkp.const.WORKFLOW_STAGE_ID_EXTERNAL_REVIEW],
				},
			},
			{
				component: 'FileManager',
				props: {
					namespace: 'copyeditedFiles',
					submissionId: submission.id,
					fileStages: [pkp.const.SUBMISSION_FILE_COPYEDIT],
					title: 'Copyedited Files (t)',
					description:
						'These are edited files that will be taken to the production stage',
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
					namespace: 'draftFiles',
					submissionId: submission.id,
					fileStages: [pkp.const.SUBMISSION_FILE_FINAL],
					title: 'Draft Files (t)',
					description:
						'These are files from the review stage which are to be copyedited',
				},
				filters: {
					dashboardPage: [DashboardPageTypes.EDITORIAL_DASHBOARD],
					activeStageId: [pkp.const.WORKFLOW_STAGE_ID_EDITING],
				},
			},

			{
				component: 'FileManager',
				props: {
					namespace: 'productionReadyFiles',
					submissionId: submission.id,
					fileStages: [pkp.const.SUBMISSION_FILE_PRODUCTION_READY],
					title: 'Production Ready Files (t)',
					description:
						'These are the files that will be sent for publication (t)',
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
					fileStages: [pkp.const.SUBMISSION_FILE_PROOF],
					title: 'Galleys (t)',
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
					reviewAssignments: submission.reviewAssignments,
				},
				filters: {
					dashboardPage: [DashboardPageTypes.EDITORIAL_DASHBOARD],
					activeStageId: [pkp.const.WORKFLOW_STAGE_ID_EXTERNAL_REVIEW],
				},
			},
			{
				component: 'ReviewerManager',
				props: {
					reviewAssignments: submission.reviewAssignments,
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
					label: 'Upload Revisions',
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
					label: 'Send submission for review',
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
					label: 'Accept and skip review',
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
					label: 'Decline submission',
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
					label: 'Request Revisions',
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
					label: 'Accept Submission',
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
					label: 'Cancel Review Round',
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
					label: 'Decline Submission',
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
					label: 'Accept review (t)',
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
					label: 'Access review form (t)',
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
					label: 'Upload File (t)',
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
					label: 'Decline',
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
					label: 'Send to Production',
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
					label: 'Schedule for Publication',
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
					label: 'Preview',
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
					label: 'Unschedule',
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
				component: 'EditorsAssigned',
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
					heading: 'Submitted on (t)',
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
					heading: 'Days since submission: (t)',
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
					heading: 'Days in submission: (t)',
					body: 'todo not in api',
				},
				filters: {
					dashboardPage: [DashboardPageTypes.EDITORIAL_DASHBOARD],
					activeStageId: [pkp.const.WORKFLOW_STAGE_ID_SUBMISSION],
				},
			},
			{
				component: 'BasicMetadata',
				props: {
					heading: 'Days in review: (t)',
					body: 'todo not in api',
				},
				filters: {
					dashboardPage: [DashboardPageTypes.EDITORIAL_DASHBOARD],
					activeStageId: [pkp.const.WORKFLOW_STAGE_ID_EXTERNAL_REVIEW],
				},
			},
			{
				component: 'BasicMetadata',
				props: {
					heading: 'Days in copyediting: (t)',
					body: 'todo not in api',
				},
				filters: {
					dashboardPage: [DashboardPageTypes.EDITORIAL_DASHBOARD],
					activeStageId: [pkp.const.WORKFLOW_STAGE_ID_EDITING],
				},
			},
			{
				component: 'BasicMetadata',
				props: {
					heading: 'Days in production: (t)',
					body: 'todo not in api',
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
					heading: 'Journal name: (t)',
					body: 'todo not in api',
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
					heading: 'Type: (t)',
					body: 'todo not in api',
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
					heading: 'Abstract (t)',
					body: localizeSubmission(
						currentPublication?.abstract,
						currentPublication?.locale,
					),
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
					heading: 'Keywords (t)',
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
					heading: 'Submission Language (t)',
					body: `${currentPublication?.locale} (todo show language name not locale)`,
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
		];
	}

	return {
		filterItemsBasedOnContext,
		getPrimaryItems,
		getActionItems,
		getMetaItems,
	};
}
