export function useSubmission() {
	function getActiveStage(submission) {
		return submission.stages.find((stage) => stage.isActiveStage);
	}

	function getActiveReviewRound(submission) {
		return submission?.reviewRounds?.length
			? submission?.reviewRounds[submission.reviewRounds.length - 1]
			: null;
	}

	function getActiveReviewAssignments(submission) {
		const activeReviewRound = getActiveReviewRound(submission);

		return submission.reviewAssignments.filter(
			(reviewAssignment) => reviewAssignment.round === activeReviewRound.round,
		);
	}

	function getCurrentPublication(submission) {
		return submission.publications.find(
			(publication) => publication.id === submission.currentPublicationId,
		);
	}

	function getFileStageFromWorkflowStage(submission) {
		const FileStageMapping = {
			[pkp.const.WORKFLOW_STAGE_ID_SUBMISSION]:
				pkp.const.SUBMISSION_FILE_SUBMISSION,
			[pkp.const.WORKFLOW_STAGE_ID_EXTERNAL_REVIEW]:
				pkp.const.SUBMISSION_FILE_REVIEW_REVISION,
			[pkp.const.WORKFLOW_STAGE_ID_EDITING]: pkp.const.SUBMISSION_FILE_FINAL,
		};

		return FileStageMapping[submission.stageId];
	}

	return {
		getActiveStage,
		getActiveReviewRound,
		getActiveReviewAssignments,
		getCurrentPublication,
		getFileStageFromWorkflowStage,
	};
}
