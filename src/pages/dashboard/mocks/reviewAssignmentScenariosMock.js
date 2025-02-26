import {getReviewAssignmentFullMock} from './reviewAssignmentsMock';
export const ReviewAssignmentEditorialActivityScenario = [
	// Review stage
	//REVIEW_ASSIGNMENT_STATUS_AWAITING_RESPONSE // request has been sent but reviewer has not responded
	getReviewAssignmentFullMock({
		submissionId: 1,
		statusId: pkp.const.REVIEW_ASSIGNMENT_STATUS_AWAITING_RESPONSE,
	}),
	// REVIEW_ASSIGNMENT_STATUS_DECLINED; // reviewer declined review request
	getReviewAssignmentFullMock({
		submissionId: 2,
		statusId: pkp.const.REVIEW_ASSIGNMENT_STATUS_DECLINED,
	}),
	// REVIEW_ASSIGNMENT_STATUS_RESPONSE_OVERDUE
	getReviewAssignmentFullMock({
		submissionId: 3,
		statusId: pkp.const.REVIEW_ASSIGNMENT_STATUS_RESPONSE_OVERDUE,
	}),
	// REVIEW_ASSIGNMENT_STATUS_ACCEPTED
	getReviewAssignmentFullMock({
		submissionId: 4,
		statusId: pkp.const.REVIEW_ASSIGNMENT_STATUS_ACCEPTED,
	}),
	// REVIEW_ASSIGNMENT_STATUS_REVIEW_OVERDUE
	getReviewAssignmentFullMock({
		submissionId: 5,
		statusId: pkp.const.REVIEW_ASSIGNMENT_STATUS_REVIEW_OVERDUE,
	}),
	// REVIEW_ASSIGNMENT_STATUS_RECEIVED
	getReviewAssignmentFullMock({
		submissionId: 6,
		statusId: pkp.const.REVIEW_ASSIGNMENT_STATUS_RECEIVED,
	}),
	// REVIEW_ASSIGNMENT_STATUS_COMPLETE
	getReviewAssignmentFullMock({
		submissionId: 7,
		statusId: pkp.const.REVIEW_ASSIGNMENT_STATUS_COMPLETE,
	}),
	// REVIEW_ASSIGNMENT_STATUS_THANKED
	getReviewAssignmentFullMock({
		submissionId: 8,
		statusId: pkp.const.REVIEW_ASSIGNMENT_STATUS_THANKED,
	}),
	// REVIEW_ASSIGNMENT_STATUS_REQUEST_RESEND
	getReviewAssignmentFullMock({
		submissionId: 9,
		statusId: pkp.const.REVIEW_ASSIGNMENT_STATUS_REQUEST_RESEND,
	}),
	// REVIEW_ASSIGNMENT_STATUS_VIEWED
	getReviewAssignmentFullMock({
		submissionId: 10,
		statusId: pkp.const.REVIEW_ASSIGNMENT_STATUS_VIEWED,
	}),
	// When moved to copyediting / production stage
	// When the review was not completed (submitted)
	getReviewAssignmentFullMock({
		submissionId: 11,
		statusId: pkp.const.REVIEW_ASSIGNMENT_STATUS_ACCEPTED,
		submissionStageId: pkp.const.WORKFLOW_STAGE_ID_PRODUCTION,
	}),
	// When moved to copyediting / production stage
	// When the review was declined - same indication for declined regardless of the stage
	getReviewAssignmentFullMock({
		submissionId: 12,
		statusId: pkp.const.REVIEW_ASSIGNMENT_STATUS_DECLINED,
		submissionStageId: pkp.const.WORKFLOW_STAGE_ID_PRODUCTION,
	}),
];
