// this one is in submission.reviewAssignments
const CommonDefaultShort = {
	id: 1,
	round: 1,
	roundId: 10,
	reviewerId: 10,
	reviewerFullName: 'Julie Janssen',
	reviewerDisplayInitials: 'JJ',
	dateAssigned: '2024-01-10',
	dateResponseDue: '2024-02-10',
	dateDue: '2024-03-10',
	dateConfirmed: null,
	reviewMethod: pkp.const.SUBMISSION_REVIEW_METHOD_ANONYMOUS,
	recommendation: null,
	statusId: pkp.const.REVIEW_ASSIGNMENT_STATUS_AWAITING_RESPONSE,
};

// Thats returned from the _submissions/reviewAssignments
const CommonDefaultFull = {
	publicationTitle: {
		en: 'Sodium butyrate improves growth performance of weaned piglets during the first period after weaning',
		fr_CA: '',
	},
	submissionId: 2,
};

const ReviewAssignmentsPerStatus = {
	[pkp.const.REVIEW_ASSIGNMENT_STATUS_AWAITING_RESPONSE]: {
		statusId: pkp.const.REVIEW_ASSIGNMENT_STATUS_AWAITING_RESPONSE,
	},
	[pkp.const.REVIEW_ASSIGNMENT_STATUS_DECLINED]: {
		statusId: pkp.const.REVIEW_ASSIGNMENT_STATUS_DECLINED,
		dateConfirmed: '2024-01-15',
	},
	[pkp.const.REVIEW_ASSIGNMENT_STATUS_RESPONSE_OVERDUE]: {
		statusId: pkp.const.REVIEW_ASSIGNMENT_STATUS_RESPONSE_OVERDUE,
	},
	[pkp.const.REVIEW_ASSIGNMENT_STATUS_ACCEPTED]: {
		statusId: pkp.const.REVIEW_ASSIGNMENT_STATUS_ACCEPTED,
	},
	[pkp.const.REVIEW_ASSIGNMENT_STATUS_REVIEW_OVERDUE]: {
		statusId: pkp.const.REVIEW_ASSIGNMENT_STATUS_REVIEW_OVERDUE,
	},
	[pkp.const.REVIEW_ASSIGNMENT_STATUS_RECEIVED]: {
		statusId: pkp.const.REVIEW_ASSIGNMENT_STATUS_RECEIVED,
		dateCompleted: '2024-01-20',
		recommendation: pkp.const.SUBMISSION_REVIEWER_RECOMMENDATION_RESUBMIT_HERE,
	},
	[pkp.const.REVIEW_ASSIGNMENT_STATUS_VIEWED]: {
		statusId: pkp.const.REVIEW_ASSIGNMENT_STATUS_VIEWED,
		dateCompleted: '2024-01-20',
	},
	[pkp.const.REVIEW_ASSIGNMENT_STATUS_COMPLETE]: {
		statusId: pkp.const.REVIEW_ASSIGNMENT_STATUS_COMPLETE,
		dateConfirmed: '2024-01-25',
		dateCompleted: '2024-01-20',
	},
	[pkp.const.REVIEW_ASSIGNMENT_STATUS_THANKED]: {
		statusId: pkp.const.REVIEW_ASSIGNMENT_STATUS_THANKED,
		dateCompleted: '2024-01-20',
	},
	[pkp.const.REVIEW_ASSIGNMENT_STATUS_CANCELLED]: {
		statusId: pkp.const.REVIEW_ASSIGNMENT_STATUS_CANCELLED,
		dateCancelled: '2024-02-10',
	},
	[pkp.const.REVIEW_ASSIGNMENT_STATUS_REQUEST_RESEND]: {
		statusId: pkp.const.REVIEW_ASSIGNMENT_STATUS_REQUEST_RESEND,
		dateResponseDue: '2024-04-10',
		dateDue: '2024-05-10',
	},
};

// Thats returned on submission object as submission.reviewAssignment

export function getReviewAssignmentShortMock(overrides = {}) {
	let reviewAssignment = {...CommonDefaultShort};
	if (overrides.statusId) {
		reviewAssignment = {
			...reviewAssignment,
			...ReviewAssignmentsPerStatus[overrides.statusId],
		};
	}
	const result = {...reviewAssignment, ...overrides};

	return result;
}

// Thats returned from the _submissions/reviewAssignments
export function getReviewAssignmentFullMock(overrides = {}) {
	let reviewAssignment = {...CommonDefaultShort, ...CommonDefaultFull};
	if (overrides.statusId) {
		reviewAssignment = {
			...reviewAssignment,
			...ReviewAssignmentsPerStatus[overrides.statusId],
		};
	}
	const result = {...reviewAssignment, ...overrides};

	// copy statusId to status as thats whats expected there
	result.status = result.statusId;
	delete result.statusId;
	return result;
}
