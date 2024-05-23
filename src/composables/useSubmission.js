export function useSubmission() {
	function getActiveStage(submission) {
		return submission.stages.find((stage) => stage.isActiveStage);
	}

	function getCurrentReviewRound(submission) {
		return submission?.reviewRounds?.length
			? submission?.reviewRounds[submission.reviewRounds.length - 1]
			: null;
	}

	function getCurrentReviewAssignments(submission) {
		const currentReviewRound = getCurrentReviewRound(submission);

		return submission.reviewAssignments.filter(
			(reviewAssignment) => reviewAssignment.round === currentReviewRound.round,
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
		getCurrentReviewRound,
		getCurrentReviewAssignments,
		getCurrentPublication,
		getFileStageFromWorkflowStage,
	};
}
