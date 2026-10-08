import {getSubmissionMock} from '../../../mockFactories/submissionMock';
import {getReviewRoundMock} from '../../../mockFactories/reviewRoundsMock';
import {getReviewAssignmentShortMock} from '../../../mockFactories/reviewAssignmentsMock';

// Dates are relative to the mocked date of the dashboard stories: 2024-02-20

/**
 * Every status a review assignment can have, one per submission
 */
const ReviewAssignmentsPerScenario = [
	// 1. REVIEW_ASSIGNMENT_STATUS_AWAITING_RESPONSE
	{
		statusId: pkp.const.REVIEW_ASSIGNMENT_STATUS_AWAITING_RESPONSE,
		dateAssigned: '2024-02-10',
		dateResponseDue: '2024-03-01',
		dateDue: '2024-03-15',
	},
	// 2. REVIEW_ASSIGNMENT_STATUS_RESPONSE_OVERDUE
	{
		statusId: pkp.const.REVIEW_ASSIGNMENT_STATUS_RESPONSE_OVERDUE,
		dateAssigned: '2024-02-05',
		dateResponseDue: '2024-02-15',
		dateDue: '2024-03-15',
	},
	// 3. REVIEW_ASSIGNMENT_STATUS_ACCEPTED
	{
		statusId: pkp.const.REVIEW_ASSIGNMENT_STATUS_ACCEPTED,
		dateAssigned: '2024-02-05',
		dateResponseDue: '2024-02-15',
		dateConfirmed: '2024-02-12',
		dateDue: '2024-03-05',
	},
	// 4. REVIEW_ASSIGNMENT_STATUS_REVIEW_OVERDUE
	{
		statusId: pkp.const.REVIEW_ASSIGNMENT_STATUS_REVIEW_OVERDUE,
		dateAssigned: '2024-01-20',
		dateResponseDue: '2024-01-30',
		dateConfirmed: '2024-01-25',
		dateDue: '2024-02-13',
	},
	// 5. REVIEW_ASSIGNMENT_STATUS_RECEIVED
	{
		statusId: pkp.const.REVIEW_ASSIGNMENT_STATUS_RECEIVED,
		dateAssigned: '2024-01-20',
		dateResponseDue: '2024-01-30',
		dateConfirmed: '2024-01-25',
		dateDue: '2024-02-25',
		dateCompleted: '2024-02-18',
		reviewerRecommendationId: 2,
	},
	// 6. REVIEW_ASSIGNMENT_STATUS_VIEWED
	{
		statusId: pkp.const.REVIEW_ASSIGNMENT_STATUS_VIEWED,
		dateAssigned: '2024-01-20',
		dateResponseDue: '2024-01-30',
		dateConfirmed: '2024-01-25',
		dateDue: '2024-02-25',
		dateCompleted: '2024-02-18',
		reviewerRecommendationId: 2,
	},
	// 7. REVIEW_ASSIGNMENT_STATUS_COMPLETE
	{
		statusId: pkp.const.REVIEW_ASSIGNMENT_STATUS_COMPLETE,
		dateAssigned: '2024-01-20',
		dateResponseDue: '2024-01-30',
		dateConfirmed: '2024-01-25',
		dateDue: '2024-02-25',
		dateCompleted: '2024-02-16',
		dateConsidered: '2024-02-18',
		reviewerRecommendationId: 1,
	},
	// 8. REVIEW_ASSIGNMENT_STATUS_THANKED
	{
		statusId: pkp.const.REVIEW_ASSIGNMENT_STATUS_THANKED,
		dateAssigned: '2024-01-20',
		dateResponseDue: '2024-01-30',
		dateConfirmed: '2024-01-25',
		dateDue: '2024-02-25',
		dateCompleted: '2024-02-16',
		dateConsidered: '2024-02-18',
		reviewerRecommendationId: 1,
	},
	// 9. REVIEW_ASSIGNMENT_STATUS_DECLINED
	// the date of the response is in dateConfirmed
	{
		statusId: pkp.const.REVIEW_ASSIGNMENT_STATUS_DECLINED,
		dateAssigned: '2024-02-05',
		dateResponseDue: '2024-02-25',
		dateConfirmed: '2024-02-17',
		dateDue: '2024-03-15',
	},
	// 10. REVIEW_ASSIGNMENT_STATUS_CANCELLED
	// only an accepted request can be cancelled
	{
		statusId: pkp.const.REVIEW_ASSIGNMENT_STATUS_CANCELLED,
		dateAssigned: '2024-02-05',
		dateResponseDue: '2024-02-15',
		dateConfirmed: '2024-02-12',
		dateDue: '2024-03-15',
		dateCancelled: '2024-02-18 09:30:00',
	},
	// 11. REVIEW_ASSIGNMENT_STATUS_REQUEST_RESEND
	{
		statusId: pkp.const.REVIEW_ASSIGNMENT_STATUS_REQUEST_RESEND,
		dateAssigned: '2024-02-01',
		dateResponseDue: '2024-03-01',
		dateConfirmed: null,
		dateDue: '2024-03-15',
	},
];

const ReviewRoundStatusPerReviewAssignmentStatus = {
	[pkp.const.REVIEW_ASSIGNMENT_STATUS_RESPONSE_OVERDUE]:
		pkp.const.REVIEW_ROUND_STATUS_REVIEWS_OVERDUE,
	[pkp.const.REVIEW_ASSIGNMENT_STATUS_REVIEW_OVERDUE]:
		pkp.const.REVIEW_ROUND_STATUS_REVIEWS_OVERDUE,
	[pkp.const.REVIEW_ASSIGNMENT_STATUS_RECEIVED]:
		pkp.const.REVIEW_ROUND_STATUS_REVIEWS_READY,
	[pkp.const.REVIEW_ASSIGNMENT_STATUS_VIEWED]:
		pkp.const.REVIEW_ROUND_STATUS_REVIEWS_READY,
	[pkp.const.REVIEW_ASSIGNMENT_STATUS_COMPLETE]:
		pkp.const.REVIEW_ROUND_STATUS_REVIEWS_COMPLETED,
	[pkp.const.REVIEW_ASSIGNMENT_STATUS_THANKED]:
		pkp.const.REVIEW_ROUND_STATUS_REVIEWS_COMPLETED,
};

export const ReviewAssignmentStatusScenario = ReviewAssignmentsPerScenario.map(
	(reviewAssignment, index) =>
		getSubmissionMock({
			id: index + 1,
			stageId: pkp.const.WORKFLOW_STAGE_ID_EXTERNAL_REVIEW,
			reviewAssignments: [
				getReviewAssignmentShortMock({id: index + 1, ...reviewAssignment}),
			],
			reviewRounds: [
				getReviewRoundMock({
					statusId:
						ReviewRoundStatusPerReviewAssignmentStatus[
							reviewAssignment.statusId
						] || pkp.const.REVIEW_ROUND_STATUS_PENDING_REVIEWS,
				}),
			],
		}),
);
