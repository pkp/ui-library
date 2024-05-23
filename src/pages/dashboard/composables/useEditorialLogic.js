import {useSubmission} from '@/composables/useSubmission.js';
const {getActiveStage, getCurrentReviewRound, getCurrentReviewAssignments} =
	useSubmission();

export function useEditorialLogic(dashboardPage) {
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

	function getEditorialActivityForMyReviewAssignments(submission) {}

	return {
		getEditorialActivityForEditorialDashboard,
		getEditorialActivityForMySubmissions,
		getEditorialActivityForMyReviewAssignments,
	};
}
