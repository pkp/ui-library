const InProgressReviewAssignmentStatuses = [
	pkp.const.REVIEW_ASSIGNMENT_STATUS_ACCEPTED,
	pkp.const.REVIEW_ASSIGNMENT_STATUS_REVIEW_OVERDUE,
];
const CompletedReviewAssignmentStatuses = [
	pkp.const.REVIEW_ASSIGNMENT_STATUS_RECEIVED,
	pkp.const.REVIEW_ASSIGNMENT_STATUS_COMPLETE,
	pkp.const.REVIEW_ASSIGNMENT_STATUS_THANKED,
	pkp.const.REVIEW_ASSIGNMENT_STATUS_CANCELLED,
	pkp.const.REVIEW_ASSIGNMENT_STATUS_REQUEST_RESEND,
];

const IgnoredReviewAssignmentStatuses = [
	pkp.const.REVIEW_ASSIGNMENT_STATUS_DECLINED,
	pkp.const.REVIEW_ASSIGNMENT_STATUS_CANCELLED,
];

export function useReviewAssignment() {
	function getActiveReviewAssignments(reviewAssignments) {
		return reviewAssignments.filter(
			(reviewAssignment) =>
				!IgnoredReviewAssignmentStatuses.includes(reviewAssignment.statusId),
		);
	}

	function getCompletedReviewAssignments(reviewAssignments = []) {
		return getActiveReviewAssignments(reviewAssignments).filter(
			(reviewAssignment) =>
				CompletedReviewAssignmentStatuses.includes(reviewAssignment.statusId),
		);
	}

	function getOpenReviewAssignments(reviewAssignments = []) {
		return reviewAssignments.filter(
			(reviewAssignment) =>
				reviewAssignment.reviewMethod ===
				pkp.const.SUBMISSION_REVIEW_METHOD_OPEN,
		);
	}

	function getReviewMethodIcons(reviewAssignment) {
		switch (reviewAssignment.reviewMethod) {
			case pkp.const.SUBMISSION_REVIEW_METHOD_ANONYMOUS:
				return ['OpenReview', 'AnonymousReview'];
			case pkp.const.SUBMISSION_REVIEW_METHOD_DOUBLEANONYMOUS:
				return ['AnonymousReview', 'AnonymousReview'];
			case pkp.const.SUBMISSION_REVIEW_METHOD_OPEN:
				return ['OpenReview', 'OpenReview'];
		}

		return ['OpenReview', 'OpenReview'];
	}

	return {
		getActiveReviewAssignments,
		getCompletedReviewAssignments,
		getOpenReviewAssignments,
		getReviewMethodIcons,
		InProgressReviewAssignmentStatuses,
	};
}
