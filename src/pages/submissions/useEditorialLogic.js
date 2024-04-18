import {useSubmission} from './useSubmission.js';

const {getActiveStage, getActiveReviewRound, getActiveReviewAssignments} =
	useSubmission();

export function useEditorialLogic() {
	function getEditorialActivityForEditorConfig(submission) {
		const activeStage = getActiveStage(submission);

		if (activeStage.id === pkp.const.WORKFLOW_STAGE_ID_EXTERNAL_REVIEW) {
			console.log('ii:', submission.id, ', ', activeStage.statusId);
			const activeRound = getActiveReviewRound(submission);
			if (
				activeRound.statusId === pkp.const.REVIEW_ROUND_STATUS_PENDING_REVIEWERS
			) {
				return {
					component: 'CellContentActivityAlert',
					props: {
						itemId: submission.id,
						actionName: 'assignReviewers',
						actionLabel: 'Assign Reviewers', // TODO localisation
					},
				};
				// Revisions requested from author
			} else if (
				activeRound.statusId ===
					pkp.const.REVIEW_ROUND_STATUS_REVISIONS_REQUESTED ||
				activeRound.statusId ===
					pkp.const.REVIEW_ROUND_STATUS_RESUBMIT_FOR_REVIEW
			) {
				return {
					component: 'CellContentActivityAlert',
					props: {
						alertLabel: 'Revisions requested from Author',
					},
				};
			} else {
				return {
					component: 'CellContentActivityReviews',
					props: {
						reviewAssignments: getActiveReviewAssignments(submission),
					},
				};
			}
		}

		return {};
	}

	return {getEditorialActivityForEditorConfig};
}
