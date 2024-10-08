import {useSubmission} from '@/composables/useSubmission.js';
import {useLocalize} from '@/composables/useLocalize';
import {useDate} from '@/composables/useDate';
import {Actions as ParticipantManagerActions} from '@/managers/ParticipantManager/useParticipantManagerActions';
import {Actions as WorkflowActions} from '@/pages/workflow/composables/useWorkflowActions';
import {Actions as ReviewerManagerActions} from '@/managers/ReviewerManager/useReviewerManagerActions';

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
							actionName: ParticipantManagerActions.PARTICIPANT_ASSIGN,
							actionLabel: t('dashboard.assignEditor'),
							actionArgs: {submissionId: submission.id},
						},
					},
				];
			}
		}
		if (activeStage.id === pkp.const.WORKFLOW_STAGE_ID_EXTERNAL_REVIEW) {
			const activeRound = getCurrentReviewRound(submission);

			if (activeStage.currentUserDecidingEditor) {
				// just hack for illustration
				switch (activeRound.statusId) {
					case pkp.const.REVIEW_ROUND_STATUS_PENDING_REVIEWERS:
					case pkp.const.REVIEW_ROUND_STATUS_PENDING_REVIEWS:
					case pkp.const.REVIEW_ROUND_STATUS_REVIEWS_READY:
					case pkp.const.REVIEW_ROUND_STATUS_REVIEWS_COMPLETED:
					case pkp.const.REVIEW_ROUND_STATUS_REVIEWS_OVERDUE:
					case pkp.const.REVIEW_ROUND_STATUS_RETURNED_TO_REVIEW:
						activeRound.statusId =
							pkp.const.REVIEW_ROUND_STATUS_PENDING_RECOMMENDATIONS;
				}
			}
			if (
				activeRound.statusId === pkp.const.REVIEW_ROUND_STATUS_PENDING_REVIEWERS
			) {
				return [
					{
						component: 'CellSubmissionActivityActionAlert',
						props: {
							actionName: ReviewerManagerActions.REVIEWER_ADD_REVIEWER,
							actionLabel: t('dashboard.assignReviewers'),
							actionArgs: {
								reviewRoundId: activeRound.id,
								submissionId: submission.id,
							},
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
							submissionId: submission.id,
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
							alert: t('dashboard.revisionsSubmitted'),
						},
					},
					{
						component: 'CellSubmissionActivityReviews',
						props: {
							submissionId: submission.id,
							reviewAssignments: getCurrentReviewAssignments(submission),
						},
					},
				];
			} else if (
				activeRound.statusId ===
				pkp.const.REVIEW_ROUND_STATUS_PENDING_RECOMMENDATIONS
			) {
				if (activeStage.currentUserCanRecommendOnly) {
					return [];
				}
				return [
					{
						component: 'CellSubmissionActivityActionAlert',
						props: {
							alert: t('dashboard.recommendOnly.pendingRecommendations'),
						},
					},
				];
			} else if (
				activeRound.statusId ===
				pkp.const.REVIEW_ROUND_STATUS_RECOMMENDATIONS_READY
			) {
				return [
					{
						component: 'CellSubmissionActivityActionAlert',
						props: {
							alert: t('dashboard.recommendOnly.recommendationsReady'),
						},
					},
				];
			} else if (
				activeRound.statusId ===
				pkp.const.REVIEW_ROUND_STATUS_RECOMMENDATIONS_COMPLETED
			) {
				return [
					{
						component: 'CellSubmissionActivityActionAlert',
						props: {
							alert: t('dashboard.recommendOnly.recommendationsCompleted'),
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
							alert: t('dashboard.revisionsSubmitted'),
						},
					},
					{
						component: 'CellSubmissionActivityActionAlert',
						props: {
							alert: t('dashboard.newReviewRoundToBeCreated'),
						},
					},
				];
			} else if (
				activeRound.statusId === pkp.const.REVIEW_ROUND_STATUS_DECLINED
			) {
				return [
					{
						component: 'CellSubmissionActivityActionAlert',
						props: {
							alert: t('dashboard.declinedDuringStage', {
								stageName: t('manager.publication.reviewStage'),
							}),
						},
					},
				];
			} else {
				return [
					{
						component: 'CellSubmissionActivityReviews',
						props: {
							submissionId: submission.id,
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
				[pkp.const.REVIEW_ROUND_STATUS_REVISIONS_REQUESTED].includes(
					activeRound.statusId,
				)
			) {
				return [
					{
						component: 'CellSubmissionActivityActionAlert',
						props: {
							alert: t('dashboard.revisionRequested'),
							actionLabel: t('dashboard.submitRevisions'),
							actionName: WorkflowActions.UPLOAD_REVISIONS,
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
						alert: t('dashboard.deadlineForCompletingReviewHasPassed'),
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
