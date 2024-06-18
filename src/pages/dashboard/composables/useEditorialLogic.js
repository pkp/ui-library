import {useSubmission} from '@/composables/useSubmission.js';
import {useLocalize} from '@/composables/useLocalize';
import {useDate} from '@/composables/useDate';

const {formatShortDate} = useDate();

const {t} = useLocalize();
const {getActiveStage, getCurrentReviewRound, getCurrentReviewAssignments} =
	useSubmission();

export function useEditorialLogic() {
	function getEditorialActivityForEditorialDashboard(submission) {
		const activeStage = getActiveStage(submission);

		if (activeStage.id === pkp.const.WORKFLOW_STAGE_ID_SUBMISSION) {
			if (!submission.editorAssigned) {
				return [
					{
						component: 'CellSubmissionActivityActionAlert',
						props: {
							actionName: 'assignParticipant',
							actionLabel: t('dashboard.assignEditor'),
						},
					},
				];
			}
		}
		if (activeStage.id === pkp.const.WORKFLOW_STAGE_ID_EXTERNAL_REVIEW) {
			const activeRound = getCurrentReviewRound(submission);
			if (
				activeRound.statusId === pkp.const.REVIEW_ROUND_STATUS_PENDING_REVIEWERS
			) {
				return [
					{
						component: 'CellSubmissionActivityActionAlert',
						props: {
							actionName: 'assignReviewers',
							actionLabel: t('dashboard.assignReviewers'),
						},
					},
				];
			} else if (
				activeRound.statusId ===
				pkp.const.REVIEW_ROUND_STATUS_REVISIONS_REQUESTED
			) {
				return [
					{
						component: 'CellSubmissionActivityActionAlert',
						props: {
							alert: t('dashboard.revisionRequestedFromAuthor'),
						},
					},
					{
						component: 'CellSubmissionActivityReviews',
						props: {
							reviewAssignments: getCurrentReviewAssignments(submission),
						},
					},
				];
			} else if (
				activeRound.statusId ===
				pkp.const.REVIEW_ROUND_STATUS_RESUBMIT_FOR_REVIEW
			) {
				return [
					{
						component: 'CellSubmissionActivityActionAlert',
						props: {
							alert: t('dashboard.revisionsRequestedFromAuthorNextRound'),
						},
					},
				];
			} else if (
				activeRound.statusId ===
				pkp.const.REVIEW_ROUND_STATUS_REVISIONS_SUBMITTED
			) {
				return [
					{
						component: 'CellSubmissionActivityActionAlert',
						props: {
							alert: t('dashboard.revisionsSubmittedByAuthor'),
						},
					},
					{
						component: 'CellSubmissionActivityReviews',
						props: {
							reviewAssignments: getCurrentReviewAssignments(submission),
						},
					},
				];
			} else if (
				activeRound.statusId ===
				pkp.const.REVIEW_ROUND_STATUS_RESUBMIT_FOR_REVIEW_SUBMITTED
			) {
				return [
					{
						component: 'CellSubmissionActivityActionAlert',
						props: {
							alert: t('dashboard.revisionsSubmittedByAuthor'),
						},
					},
					{
						component: 'CellSubmissionActivityActionAlert',
						props: {
							alert: t('dashboard.newReviewRoundToBeCreated'),
						},
					},
				];
			} else {
				return [
					{
						component: 'CellSubmissionActivityReviews',
						props: {
							reviewAssignments: getCurrentReviewAssignments(submission),
						},
					},
				];
			}
		}

		return {};
	}

	function getEditorialActivityForMySubmissions(submission) {
		const activeStage = getActiveStage(submission);

		if (activeStage.id === pkp.const.WORKFLOW_STAGE_ID_EXTERNAL_REVIEW) {
			const activeRound = getCurrentReviewRound(submission);

			if (
				[
					pkp.const.REVIEW_ROUND_STATUS_REVISIONS_REQUESTED,
					pkp.const.REVIEW_ROUND_STATUS_RESUBMIT_FOR_REVIEW,
				].includes(activeRound.statusId)
			) {
				// Todo refine once these are covered in nextcloud
				return [
					{
						component: 'CellSubmissionActivityActionAlert',
						props: {
							alert: t('dashboard.revisionRequested'),
							actionLabel: t('dashboard.submitRevisions'),
							actionName: 'uploadRevisions',
						},
					},
				];
			} else {
				const reviewAssignments = getCurrentReviewAssignments(submission);

				return [
					{
						component: 'CellSubmissionActivityReviewsUpdate',
						props: {
							reviewAssignments,
						},
					},
					{
						component: 'CellSubmissionActivityReviewsOpen',
						props: {
							reviewAssignments,
						},
					},
				];
			}
		}

		return {};
	}

	function getEditorialActivityForMyReviewAssignments(reviewAssignment) {
		if (
			reviewAssignment.status ===
			pkp.const.REVIEW_ASSIGNMENT_STATUS_AWAITING_RESPONSE
		) {
			const date = reviewAssignment.dateResponseDue;
			return [
				{
					component: 'CellReviewAssignmentActivityAlert',
					props: {
						alert: t('dashboard.acceptOrDeclineRequestDate', {
							date: formatShortDate(date),
						}),
					},
				},
			];
			// Declined missing text
		} else if (
			reviewAssignment.status === pkp.const.REVIEW_ASSIGNMENT_STATUS_DECLINED
		) {
			return [
				{
					component: 'CellReviewAssignmentActivityAlert',
					props: {
						alert: `Missing text`,
					},
				},
			];
		} else if (
			reviewAssignment.status ===
			pkp.const.REVIEW_ASSIGNMENT_STATUS_RESPONSE_OVERDUE
		) {
			return [
				{
					component: 'CellReviewAssignmentActivityAlert',
					props: {
						alert: t('dashboard.deadlineForRespondingAcceptOrDecline'),
					},
				},
			];
		} else if (
			reviewAssignment.status === pkp.const.REVIEW_ASSIGNMENT_STATUS_ACCEPTED
		) {
			const date = reviewAssignment.dateDue;

			return [
				{
					component: 'CellReviewAssignmentActivityAlert',
					props: {
						alert: t('dashboard.completeReviewByDate', {date}),
					},
				},
			];
		} else if (
			reviewAssignment.status ===
			pkp.const.REVIEW_ASSIGNMENT_STATUS_REVIEW_OVERDUE
		) {
			return [
				{
					component: 'CellReviewAssignmentActivityAlert',
					props: {
						alert: t('dashboard.deadlineForComplitingReviewHasPassed'),
					},
				},
			];
		} else if (
			[
				pkp.const.REVIEW_ASSIGNMENT_STATUS_RECEIVED,
				pkp.const.REVIEW_ASSIGNMENT_STATUS_VIEWED,
				pkp.const.REVIEW_ASSIGNMENT_STATUS_COMPLETE,
				pkp.const.REVIEW_ASSIGNMENT_STATUS_THANKED,
				pkp.const.REVIEW_ASSIGNMENT_STATUS_CANCELLED,
				pkp.const.REVIEW_ASSIGNMENT_STATUS_REQUEST_RESEND,
			].includes(reviewAssignment.statusId)
		) {
			return [
				{
					component: 'CellReviewAssignmentActivityAlert',
					props: {
						alert: `-`,
					},
				},
			];
		}

		return [];
		/**



				Deadline for completing this review has passed. Please complete the review at the earliest.

				Review in progress. Deadline is 2023.04.15 - shown when the reviewer has started filling the form but the form is incomplete
			 */
	}

	return {
		getEditorialActivityForEditorialDashboard,
		getEditorialActivityForMySubmissions,
		getEditorialActivityForMyReviewAssignments,
	};
}
