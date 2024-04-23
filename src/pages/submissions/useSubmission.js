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

	return {
		getActiveStage,
		getActiveReviewRound,
		getActiveReviewAssignments,
		getCurrentPublication,
	};
}
