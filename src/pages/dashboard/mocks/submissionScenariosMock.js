import {getSubmissionMock} from './submissionMock';
import {getPublicationMock} from './publicationMock';
import {getReviewRoundMock} from './reviewRoundsMock';
import {getReviewAssignmentMock} from './reviewAssignmentsMock';

export const EditorialActivityScenario = [
	// REVIEW_ROUND_STATUS_REVISIONS_REQUESTED
	getSubmissionMock({
		publications: [
			getPublicationMock({
				authorsStringShort: '',
				fullTitle: 'REVIEW_ROUND_STATUS_REVISIONS_REQUESTED',
			}),
		],
		reviewAssignments: [
			getReviewAssignmentMock({
				statusId: pkp.const.REVIEW_ASSIGNMENT_STATUS_RECEIVED,
				recommendation:
					pkp.const.SUBMISSION_REVIEWER_RECOMMENDATION_PENDING_REVISIONS,
			}),
		],
		reviewRounds: [
			getReviewRoundMock({
				statusId: pkp.const.REVIEW_ROUND_STATUS_REVISIONS_REQUESTED,
			}),
		],
	}),
	//REVIEW_ROUND_STATUS_RESUBMIT_FOR_REVIEW
	getSubmissionMock({
		publications: [
			getPublicationMock({
				authorsStringShort: '',
				fullTitle: 'REVIEW_ROUND_STATUS_RESUBMIT_FOR_REVIEW',
			}),
		],
		reviewAssignments: [
			getReviewAssignmentMock({
				statusId: pkp.const.REVIEW_ASSIGNMENT_STATUS_RECEIVED,
				recommendation:
					pkp.const.SUBMISSION_REVIEWER_RECOMMENDATION_PENDING_REVISIONS,
			}),
		],
		reviewRounds: [
			getReviewRoundMock({
				statusId: pkp.const.REVIEW_ROUND_STATUS_RESUBMIT_FOR_REVIEW,
			}),
		],
	}),
	// REVIEW_ROUND_STATUS_ACCEPTED
	// -- Does not happen as its moved to next stage
	// REVIEW_ROUND_STATUS_DECLINED
	getSubmissionMock({
		status: pkp.const.STATUS_DECLINED,
		publications: [
			getPublicationMock({
				authorsStringShort: '',
				fullTitle: 'REVIEW_ROUND_STATUS_DECLINED',
			}),
		],
		reviewAssignments: [
			getReviewAssignmentMock({
				statusId: pkp.const.REVIEW_ASSIGNMENT_STATUS_COMPLETE,
			}),
		],
		reviewRounds: [
			getReviewRoundMock({
				statusId: pkp.const.REVIEW_ROUND_STATUS_DECLINED,
			}),
		],
	}),
	// REVIEW_ROUND_STATUS_PENDING_REVIEWERS
	getSubmissionMock({
		publications: [
			getPublicationMock({
				authorsStringShort: '',
				fullTitle: 'REVIEW_ROUND_STATUS_PENDING_REVIEWERS',
			}),
		],
		reviewAssignments: [],
		reviewRounds: [getReviewRoundMock()],
	}),
	// REVIEW_ROUND_STATUS_PENDING_REVIEWS
	getSubmissionMock({
		publications: [
			getPublicationMock({
				authorsStringShort: '',
				fullTitle: 'REVIEW_ROUND_STATUS_PENDING_REVIEWS',
			}),
		],
		reviewAssignments: [
			getReviewAssignmentMock({
				statusId: pkp.const.REVIEW_ASSIGNMENT_STATUS_COMPLETE,
			}),
			getReviewAssignmentMock({
				statusId: pkp.const.REVIEW_ASSIGNMENT_STATUS_ACCEPTED,
			}),
		],
		reviewRounds: [
			getReviewRoundMock({
				statusId: pkp.const.REVIEW_ROUND_STATUS_PENDING_REVIEWS,
			}),
		],
	}),
	// REVIEW_ROUND_STATUS_REVIEWS_READY
	getSubmissionMock({
		publications: [
			getPublicationMock({
				authorsStringShort: '',
				fullTitle: 'REVIEW_ROUND_STATUS_REVIEWS_READY',
			}),
		],
		reviewAssignments: [
			getReviewAssignmentMock({
				statusId: pkp.const.REVIEW_ASSIGNMENT_STATUS_COMPLETE,
			}),
			getReviewAssignmentMock({
				statusId: pkp.const.REVIEW_ASSIGNMENT_STATUS_RECEIVED,
				dateCompleted: '2024-01-20',
				recommendation:
					pkp.const.SUBMISSION_REVIEWER_RECOMMENDATION_RESUBMIT_HERE,
			}),
		],
		reviewRounds: [
			getReviewRoundMock({
				statusId: pkp.const.REVIEW_ROUND_STATUS_REVIEWS_READY,
			}),
		],
	}),
	// REVIEW_ROUND_STATUS_REVIEWS_COMPLETED
	getSubmissionMock({
		publications: [
			getPublicationMock({
				authorsStringShort: '',
				fullTitle: 'REVIEW_ROUND_STATUS_REVIEWS_COMPLETED',
			}),
		],
		reviewAssignments: [
			getReviewAssignmentMock({
				statusId: pkp.const.REVIEW_ASSIGNMENT_STATUS_COMPLETE,
			}),
			getReviewAssignmentMock({
				statusId: pkp.const.REVIEW_ASSIGNMENT_STATUS_COMPLETE,
			}),
		],
		reviewRounds: [
			getReviewRoundMock({
				statusId: pkp.const.REVIEW_ROUND_STATUS_REVIEWS_COMPLETED,
			}),
		],
	}),
	// REVIEW_ROUND_STATUS_REVIEWS_OVERDUE
	getSubmissionMock({
		publications: [
			getPublicationMock({
				authorsStringShort: '',
				fullTitle: 'REVIEW_ROUND_STATUS_REVIEWS_OVERDUE',
			}),
		],
		reviewAssignments: [
			getReviewAssignmentMock({
				statusId: pkp.const.REVIEW_ASSIGNMENT_STATUS_COMPLETE,
			}),
			getReviewAssignmentMock({
				statusId: pkp.const.REVIEW_ASSIGNMENT_STATUS_RESPONSE_OVERDUE,
			}),
		],
		reviewRounds: [
			getReviewRoundMock({
				statusId: pkp.const.REVIEW_ROUND_STATUS_REVIEWS_OVERDUE,
			}),
		],
	}),
	// REVIEW_ROUND_STATUS_REVISIONS_SUBMITTED
	getSubmissionMock({
		publications: [
			getPublicationMock({
				authorsStringShort: '',
				fullTitle: 'REVIEW_ROUND_STATUS_REVISIONS_SUBMITTED',
			}),
		],
		reviewAssignments: [
			getReviewAssignmentMock({
				statusId: pkp.const.REVIEW_ASSIGNMENT_STATUS_COMPLETE,
			}),
			getReviewAssignmentMock({
				statusId: pkp.const.REVIEW_ASSIGNMENT_STATUS_RECEIVED,
			}),
		],
		reviewRounds: [
			getReviewRoundMock({
				statusId: pkp.const.REVIEW_ROUND_STATUS_REVISIONS_SUBMITTED,
			}),
		],
	}),
	// REVIEW_ROUND_STATUS_RESUBMIT_FOR_REVIEW_SUBMITTED
	getSubmissionMock({
		publications: [
			getPublicationMock({
				authorsStringShort: '',
				fullTitle: 'REVIEW_ROUND_STATUS_RESUBMIT_FOR_REVIEW_SUBMITTED',
			}),
		],
		reviewAssignments: [
			getReviewAssignmentMock({
				statusId: pkp.const.REVIEW_ASSIGNMENT_STATUS_COMPLETE,
			}),
			getReviewAssignmentMock({
				statusId: pkp.const.REVIEW_ASSIGNMENT_STATUS_RECEIVED,
			}),
		],
		reviewRounds: [
			getReviewRoundMock({
				statusId: pkp.const.REVIEW_ROUND_STATUS_RESUBMIT_FOR_REVIEW_SUBMITTED,
			}),
		],
	}),
	// REVIEW_ROUND_STATUS_RETURNED_TO_REVIEW
	getSubmissionMock({
		publications: [
			getPublicationMock({
				authorsStringShort: '',
				fullTitle: 'REVIEW_ROUND_STATUS_RETURNED_TO_REVIEW',
			}),
		],
		reviewAssignments: [
			getReviewAssignmentMock({
				statusId: pkp.const.REVIEW_ASSIGNMENT_STATUS_COMPLETE,
			}),
			getReviewAssignmentMock({
				statusId: pkp.const.REVIEW_ASSIGNMENT_STATUS_RECEIVED,
			}),
		],
		reviewRounds: [
			getReviewRoundMock({
				statusId: pkp.const.REVIEW_ROUND_STATUS_RETURNED_TO_REVIEW,
			}),
		],
	}),

	// REVIEW_ROUND_STATUS_PENDING_RECOMMENDATIONS
	getSubmissionMock({
		publications: [
			getPublicationMock({
				authorsStringShort: '',
				fullTitle: 'REVIEW_ROUND_STATUS_PENDING_RECOMMENDATIONS',
			}),
		],
		reviewAssignments: [
			getReviewAssignmentMock({
				statusId: pkp.const.REVIEW_ASSIGNMENT_STATUS_COMPLETE,
			}),
			getReviewAssignmentMock({
				statusId: pkp.const.REVIEW_ASSIGNMENT_STATUS_RECEIVED,
			}),
		],
		reviewRounds: [
			getReviewRoundMock({
				statusId: pkp.const.REVIEW_ROUND_STATUS_PENDING_RECOMMENDATIONS,
			}),
		],
	}),
	// REVIEW_ROUND_STATUS_RECOMMENDATIONS_READY
	getSubmissionMock({
		publications: [
			getPublicationMock({
				authorsStringShort: '',
				fullTitle: 'REVIEW_ROUND_STATUS_RECOMMENDATIONS_READY',
			}),
		],
		reviewAssignments: [
			getReviewAssignmentMock({
				statusId: pkp.const.REVIEW_ASSIGNMENT_STATUS_COMPLETE,
			}),
			getReviewAssignmentMock({
				statusId: pkp.const.REVIEW_ASSIGNMENT_STATUS_RECEIVED,
			}),
		],
		reviewRounds: [
			getReviewRoundMock({
				statusId: pkp.const.REVIEW_ROUND_STATUS_RECOMMENDATIONS_READY,
			}),
		],
	}),
	// REVIEW_ROUND_STATUS_RECOMMENDATIONS_COMPLETED
	getSubmissionMock({
		publications: [
			getPublicationMock({
				authorsStringShort: '',
				fullTitle: 'REVIEW_ROUND_STATUS_RECOMMENDATIONS_COMPLETED',
			}),
		],
		reviewAssignments: [
			getReviewAssignmentMock({
				statusId: pkp.const.REVIEW_ASSIGNMENT_STATUS_COMPLETE,
			}),
			getReviewAssignmentMock({
				statusId: pkp.const.REVIEW_ASSIGNMENT_STATUS_RECEIVED,
			}),
		],
		reviewRounds: [
			getReviewRoundMock({
				statusId: pkp.const.REVIEW_ROUND_STATUS_RECOMMENDATIONS_COMPLETED,
			}),
		],
	}),
];
