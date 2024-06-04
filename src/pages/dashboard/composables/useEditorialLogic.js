import {useSubmission} from '@/composables/useSubmission.js';
const {getActiveStage, getCurrentReviewRound, getCurrentReviewAssignments} =
	useSubmission();

export function useEditorialLogic() {
	function getEditorialActivityForEditorialDashboard(submission) {
		const activeStage = getActiveStage(submission);

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
							actionLabel: 'Assign Reviewers', // TODO localisation
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
							alert: 'Revisions requested from author',
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
							alert:
								'Revisions requested from the author to be taken to a new review round',
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
							alert: 'Revisions submitted by author',
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
							alert: 'Revisions submitted by the author',
						},
					},
					{
						component: 'CellSubmissionActivityActionAlert',
						props: {
							alert: 'New review round to be created',
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
							alert: 'Revision requested (t)',
							actionLabel: 'Submit revisions',
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
		console.log('reviewAssignment:', reviewAssignment);
		if (
			reviewAssignment.statusId ===
			pkp.const.REVIEW_ASSIGNMENT_STATUS_AWAITING_RESPONSE
		) {
			const date = reviewAssignment.dateResponseDue;
			return [
				{
					component: 'CellSubmissionActivityActionAlert',
					props: {
						alert: `Please accept or decline this request ${date} (t)`,
					},
				},
			];
			// Declined missing text
		} else if (
			reviewAssignment.statusId === pkp.const.REVIEW_ASSIGNMENT_STATUS_DECLINED
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
			reviewAssignment.statusId ===
			pkp.const.REVIEW_ASSIGNMENT_STATUS_RESPONSE_OVERDUE
		) {
			return [
				{
					component: 'CellReviewAssignmentActivityAlert',
					props: {
						alert: `Deadline for responding to this request has passed. Please accept or decline this request at the earliest. (t)`,
					},
				},
			];
		} else if (
			reviewAssignment.statusId === pkp.const.REVIEW_ASSIGNMENT_STATUS_ACCEPTED
		) {
			const date = reviewAssignment.dateDue;

			return [
				{
					component: 'CellReviewAssignmentActivityAlert',
					props: {
						alert: `Please complete this review by ${date}. (t)`,
					},
				},
			];
		} else if (
			reviewAssignment.statusId ===
			pkp.const.REVIEW_ASSIGNMENT_STATUS_REVIEW_OVERDUE
		) {
			return [
				{
					component: 'CellReviewAssignmentActivityAlert',
					props: {
						alert: `Deadline for completing this review has passed. Please complete the review at the earliest. (t)`,
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
						alert: `Missing text`,
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
