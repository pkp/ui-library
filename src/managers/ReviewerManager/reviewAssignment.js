// True once an editor has confirmed the review
export function isReviewConfirmed(reviewAssignment) {
	if (reviewAssignment?.considered === undefined) {
		return !!reviewAssignment?.dateConsidered;
	}

	return [
		pkp.const.REVIEW_ASSIGNMENT_CONSIDERED,
		pkp.const.REVIEW_ASSIGNMENT_RECONSIDERED,
	].includes(reviewAssignment.considered);
}
