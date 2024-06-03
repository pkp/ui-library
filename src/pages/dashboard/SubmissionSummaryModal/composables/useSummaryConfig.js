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
					activeStageId: [pkp.const.WORKFLOW_STAGE_ID_EXTERNAL_REVIEW],
				},
			},
			{
				component: 'FileManager',
				props: {
					namespace: 'filesRevisions',

					submissionId: submission.id,
					reviewRoundId: activeReviewRound.id,
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
					reviewRoundId: activeReviewRound.id,
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
					action: 'acceptSubmission',
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
					action: 'cancelReviewRound',
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
					action: 'declineSubmission',
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
		];
	}
	function getMetaItems(submission, currentPublication) {
		return [
			{
				component: 'EditorsAssigned',
				filters: {
					dashboardPage: [DashboardPageTypes.EDITORIAL_DASHBOARD],
					activeStageId: [pkp.const.WORKFLOW_STAGE_ID_EXTERNAL_REVIEW],
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
					activeStageId: [pkp.const.WORKFLOW_STAGE_ID_EXTERNAL_REVIEW],
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
					activeStageId: [pkp.const.WORKFLOW_STAGE_ID_EXTERNAL_REVIEW],
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
				component: 'IssueAssigned',
				props: {isReadonly: false},
				filters: {
					dashboardPage: [DashboardPageTypes.EDITORIAL_DASHBOARD],
					activeStageId: [pkp.const.WORKFLOW_STAGE_ID_EXTERNAL_REVIEW],
				},
			},
			{
				component: 'IssueAssigned',
				props: {isReadOnly: true},
				filters: {
					dashboardPage: [DashboardPageTypes.MY_SUBMISSIONS],
					activeStageId: [pkp.const.WORKFLOW_STAGE_ID_EXTERNAL_REVIEW],
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
					activeStageId: [pkp.const.WORKFLOW_STAGE_ID_EXTERNAL_REVIEW],
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
					activeStageId: [pkp.const.WORKFLOW_STAGE_ID_EXTERNAL_REVIEW],
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
					activeStageId: [pkp.const.WORKFLOW_STAGE_ID_EXTERNAL_REVIEW],
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
					activeStageId: [pkp.const.WORKFLOW_STAGE_ID_EXTERNAL_REVIEW],
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
