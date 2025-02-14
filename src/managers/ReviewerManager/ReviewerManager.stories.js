import ReviewerManager from './ReviewerManager.vue';
import {getSubmissionMock} from '@/pages/dashboard/mocks/submissionMock';
import {getReviewAssignmentShortMock} from '@/pages/dashboard/mocks/reviewAssignmentsMock';
import {getReviewRoundMock} from '@/pages/dashboard/mocks/reviewRoundsMock';
export default {
	title: 'Managers/ReviewerManager',
	component: ReviewerManager,
	render: (args) => ({
		components: {ReviewerManager},
		setup() {
			return {args};
		},
		template: `<ReviewerManager v-bind="args"/>`,
	}),
};

export const EditorScenarios = {
	render: (args) => ({
		components: {ReviewerManager},
		setup() {
			return {args};
		},
		template: `
            <ul class="text-sm-normal">
                <li><b>1.REVIEW_ASSIGNMENT_STATUS_AWAITING_RESPONSE</b> - request has been sent but reviewer has not responded </li>
                <li><b>2.REVIEW_ASSIGNMENT_STATUS_DECLINED</b> -  reviewer declined review request</li>
                <li><b>3.REVIEW_ASSIGNMENT_STATUS_RESPONSE_OVERDUE</b> -  review not responded within due date</li>
                <li><b>4.REVIEW_ASSIGNMENT_STATUS_ACCEPTED</b> - reviewer has agreed to the review</li>
                <li><b>5.REVIEW_ASSIGNMENT_STATUS_REVIEW_OVERDUE</b> - review not submitted within due date </li>
                <li><b>6.REVIEW_ASSIGNMENT_STATUS_RECEIVED</b> - review has been submitted</li>
                <li><b>7.REVIEW_ASSIGNMENT_STATUS_COMPLETE</b> - review has been confirmed by an editor</li>
                <li><b>8.REVIEW_ASSIGNMENT_STATUS_THANKED</b> - reviewer has been thanked </li>
                <li><b>9.REVIEW_ASSIGNMENT_STATUS_REQUEST_RESEND</b> - request resent to reviewer after they declined</li>
                <li><b>10.REVIEW_ASSIGNMENT_STATUS_VIEWED</b> - editor viewed the review, but not confirm</li>
                <li><b>11.REVIEW_ASSIGNMENT_STATUS_CANCELLED</b> - reviewer cancelled review request </li>
            </ul>
            <ReviewerManager v-bind="args"/>`,
	}),

	args: {
		reviewRoundId: 10,
		submission: getSubmissionMock({
			reviewAssignments: [
				//REVIEW_ASSIGNMENT_STATUS_AWAITING_RESPONSE // request has been sent but reviewer has not responded
				getReviewAssignmentShortMock({
					submissionId: 1,
					reviewerFullName: 'Julie Janssen (1)',
					statusId: pkp.const.REVIEW_ASSIGNMENT_STATUS_AWAITING_RESPONSE,
					reviewMethod: pkp.const.SUBMISSION_REVIEW_METHOD_OPEN,
				}),
				// REVIEW_ASSIGNMENT_STATUS_DECLINED; // reviewer declined review request
				getReviewAssignmentShortMock({
					submissionId: 2,
					reviewerFullName: 'Julie Janssen (2)',
					statusId: pkp.const.REVIEW_ASSIGNMENT_STATUS_DECLINED,
					reviewMethod: pkp.const.SUBMISSION_REVIEW_METHOD_ANONYMOUS,
				}),
				// REVIEW_ASSIGNMENT_STATUS_RESPONSE_OVERDUE
				getReviewAssignmentShortMock({
					submissionId: 3,
					reviewerFullName: 'Julie Janssen (3)',
					statusId: pkp.const.REVIEW_ASSIGNMENT_STATUS_RESPONSE_OVERDUE,
					reviewMethod: pkp.const.SUBMISSION_REVIEW_METHOD_DOUBLEANONYMOUS,
				}),
				// REVIEW_ASSIGNMENT_STATUS_ACCEPTED
				getReviewAssignmentShortMock({
					submissionId: 4,
					reviewerFullName: 'Julie Janssen (4)',
					statusId: pkp.const.REVIEW_ASSIGNMENT_STATUS_ACCEPTED,
					competingInterests: 'I have something to confess...',
				}),
				// REVIEW_ASSIGNMENT_STATUS_REVIEW_OVERDUE
				getReviewAssignmentShortMock({
					submissionId: 5,
					reviewerFullName: 'Julie Janssen (5)',
					statusId: pkp.const.REVIEW_ASSIGNMENT_STATUS_REVIEW_OVERDUE,
				}),
				// REVIEW_ASSIGNMENT_STATUS_RECEIVED
				getReviewAssignmentShortMock({
					submissionId: 6,
					reviewerFullName: 'Julie Janssen (6)',
					statusId: pkp.const.REVIEW_ASSIGNMENT_STATUS_RECEIVED,
					recommendation: pkp.const.SUBMISSION_REVIEWER_RECOMMENDATION_ACCEPT,
				}),
				// REVIEW_ASSIGNMENT_STATUS_COMPLETE
				getReviewAssignmentShortMock({
					submissionId: 7,
					reviewerFullName: 'Julie Janssen (7)',
					statusId: pkp.const.REVIEW_ASSIGNMENT_STATUS_COMPLETE,
					recommendation: pkp.const.SUBMISSION_REVIEWER_RECOMMENDATION_DECLINE,
				}),
				// REVIEW_ASSIGNMENT_STATUS_THANKED
				getReviewAssignmentShortMock({
					submissionId: 8,
					reviewerFullName: 'Julie Janssen (8)',
					statusId: pkp.const.REVIEW_ASSIGNMENT_STATUS_THANKED,
					recommendation:
						pkp.const.SUBMISSION_REVIEWER_RECOMMENDATION_SEE_COMMENTS,
				}),
				// REVIEW_ASSIGNMENT_STATUS_REQUEST_RESEND
				getReviewAssignmentShortMock({
					submissionId: 9,
					reviewerFullName: 'Julie Janssen (9)',
					statusId: pkp.const.REVIEW_ASSIGNMENT_STATUS_REQUEST_RESEND,
				}),
				// REVIEW_ASSIGNMENT_STATUS_VIEWED
				getReviewAssignmentShortMock({
					submissionId: 10,
					reviewerFullName: 'Julie Janssen (10)',
					statusId: pkp.const.REVIEW_ASSIGNMENT_STATUS_VIEWED,
					recommendation: pkp.const.SUBMISSION_REVIEWER_RECOMMENDATION_DECLINE,
				}),
				// REVIEW_ASSIGNMENT_STATUS_CANCELLED
				getReviewAssignmentShortMock({
					submissionId: 10,
					reviewerFullName: 'Julie Janssen (10)',
					statusId: pkp.const.REVIEW_ASSIGNMENT_STATUS_CANCELLED,
				}),
			],
			reviewRounds: [getReviewRoundMock({})],
		}),
	},
};

export const AuthorScenarios = {
	render: (args) => ({
		components: {ReviewerManager},
		setup() {
			return {args};
		},
		template: `
            <p class="text-base-bold">Author see only open and submitted review assignments.</p>
            <ul class="text-sm-normal">
                <li><b>1.REVIEW_ASSIGNMENT_STATUS_RECEIVED</b> - review has been submitted</li>
                <li><b>2.REVIEW_ASSIGNMENT_STATUS_COMPLETE</b> - review has been confirmed by an editor</li>
                <li><b>3.REVIEW_ASSIGNMENT_STATUS_THANKED</b> - reviewer has been thanked </li>
                <li><b>4.REVIEW_ASSIGNMENT_STATUS_VIEWED</b> - editor viewed the review, but not confirm</li>
            </ul>
            <ReviewerManager v-bind="args"/>`,
	}),

	args: {
		redactedForAuthors: true,
		reviewRoundId: 10,
		submission: getSubmissionMock({
			reviewAssignments: [
				// REVIEW_ASSIGNMENT_STATUS_RECEIVED
				getReviewAssignmentShortMock({
					submissionId: 1,
					reviewerFullName: 'Julie Janssen (1)',
					statusId: pkp.const.REVIEW_ASSIGNMENT_STATUS_RECEIVED,
					recommendation: pkp.const.SUBMISSION_REVIEWER_RECOMMENDATION_ACCEPT,
					reviewMethod: pkp.const.SUBMISSION_REVIEW_METHOD_OPEN,
				}),
				// REVIEW_ASSIGNMENT_STATUS_COMPLETE
				getReviewAssignmentShortMock({
					submissionId: 2,
					reviewerFullName: 'Julie Janssen (2)',
					statusId: pkp.const.REVIEW_ASSIGNMENT_STATUS_COMPLETE,
					recommendation: pkp.const.SUBMISSION_REVIEWER_RECOMMENDATION_DECLINE,
					reviewMethod: pkp.const.SUBMISSION_REVIEW_METHOD_OPEN,
				}),
				// REVIEW_ASSIGNMENT_STATUS_THANKED
				getReviewAssignmentShortMock({
					submissionId: 3,
					reviewerFullName: 'Julie Janssen (3)',
					reviewMethod: pkp.const.SUBMISSION_REVIEW_METHOD_OPEN,
					statusId: pkp.const.REVIEW_ASSIGNMENT_STATUS_THANKED,

					recommendation:
						pkp.const.SUBMISSION_REVIEWER_RECOMMENDATION_SEE_COMMENTS,
				}),
				// REVIEW_ASSIGNMENT_STATUS_VIEWED
				getReviewAssignmentShortMock({
					submissionId: 4,
					reviewerFullName: 'Julie Janssen (4)',
					statusId: pkp.const.REVIEW_ASSIGNMENT_STATUS_VIEWED,
					recommendation: pkp.const.SUBMISSION_REVIEWER_RECOMMENDATION_DECLINE,
					reviewMethod: pkp.const.SUBMISSION_REVIEW_METHOD_OPEN,
				}),
			],
			reviewRounds: [getReviewRoundMock({})],
		}),
	},
};
