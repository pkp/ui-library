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

	function getSummaryModalConfig(submission) {
		const activeStage = getActiveStage(submission);
		const activeReviewRound = getActiveReviewRound(submission);
		if (activeStage.id === pkp.const.WORKFLOW_STAGE_ID_EXTERNAL_REVIEW) {
			return {
				leftColumnItems: [
					{
						component: 'FileManager',
						namespace: 'filesRevisions',
						props: {
							submissionId: submission.id,
							reviewRoundId: activeReviewRound.id,
							fileStages: [pkp.const.SUBMISSION_FILE_REVIEW_REVISION],
							title: 'Revisions Submitted (localize)',
							description:
								'These files have been submitted by the author after visions were requested (localize)',
						},
					},
					{
						component: 'FileManager',
						namespace: 'filesForReview',
						props: {
							submissionId: submission.id,
							reviewRoundId: activeReviewRound.id,
							fileStages: [pkp.const.SUBMISSION_FILE_REVIEW_FILE],
							title: 'Files for review (localize)',
							description:
								'These files will be sent to the reviewers to review (localize)',
						},
					},
				],
				editorialActions: [
					{
						label: 'Request Revisions',
						type: 'secondary',
						action: 'requestRevisions',
					},
					{
						label: 'Accept Submission',
						type: 'primary',
						action: 'acceptSubmission',
					},
					{
						label: 'Cancel Review Round',
						type: 'negative',
						action: 'cancelReviewRound',
					},
					{
						label: 'Decline Submission',
						type: 'negative',
						action: 'declineSubmission',
					},
				],
			};
		}

		return {editorialActions: []};
	}

	return {getEditorialActivityForEditorConfig, getSummaryModalConfig};
}
