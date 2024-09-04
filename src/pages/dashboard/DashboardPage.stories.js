import DashboardPage from './DashboardPage.vue';
import {http, HttpResponse} from 'msw';
import SubmissionsMock25 from './mocks/submissions25.js';
import PageInitConfigMock from './mocks/pageInitConfig.js';
import {getSubmissionMock} from './mocks/submissionMock';
import {getPublicationMock} from './mocks/publicationMock';
import {getReviewRoundMock} from './mocks/reviewRoundsMock';
import {getReviewAssignmentMock} from './mocks/reviewAssignmentsMock';

export default {
	title: 'Pages/Dashboard',
	component: DashboardPage,
	render: (args) => ({
		components: {DashboardPage},
		setup() {
			return {args};
		},
		template: '<DashboardPage v-bind="args" />',
	}),
};

export const Init = {
	parameters: {
		// mock date to consistently show sensible editorial activity popups
		date: new Date('January 20, 2024 10:00:00'),
		msw: {
			handlers: [
				http.get(
					'https://mock/index.php/publicknowledge/api/v1/_submissions',
					({request}) => {
						const url = new URL(request.url);
						const offset = parseInt(url.searchParams.get('offset') || 0);
						const count = parseInt(url.searchParams.get('count'));
						const submissions = SubmissionsMock25.slice(offset, offset + count);

						return HttpResponse.json({
							itemsMax: SubmissionsMock25.length,
							items: submissions,
						});
					},
				),
				http.get(
					'https://mock/index.php/publicknowledge/api/v1/_submissions/assigned',
					({request}) => {
						const url = new URL(request.url);
						const offset = parseInt(url.searchParams.get('offset') || 0);
						const count = parseInt(url.searchParams.get('count'));
						const submissions = SubmissionsMock25.slice(offset, offset + count);

						return HttpResponse.json({
							itemsMax: SubmissionsMock25.length,
							items: submissions,
						});
					},
				),
			],
		},
	},
	args: PageInitConfigMock,
};

export const ReviewRoundStatuses = {
	parameters: {
		// mock date to consistently show sensible editorial activity popups
		date: new Date('February 20, 2024 10:00:00'),
		msw: {
			handlers: [
				http.get(
					'https://mock/index.php/publicknowledge/api/v1/_submissions/assigned',
					({request}) => {
						//console.log('pkp const??:', pkp.const);

						const submissions = [
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
											pkp.const
												.SUBMISSION_REVIEWER_RECOMMENDATION_PENDING_REVISIONS,
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
											pkp.const
												.SUBMISSION_REVIEWER_RECOMMENDATION_PENDING_REVISIONS,
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
											pkp.const
												.SUBMISSION_REVIEWER_RECOMMENDATION_RESUBMIT_HERE,
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
										statusId:
											pkp.const.REVIEW_ASSIGNMENT_STATUS_RESPONSE_OVERDUE,
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
										statusId:
											pkp.const.REVIEW_ROUND_STATUS_PENDING_RECOMMENDATIONS,
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
										statusId:
											pkp.const.REVIEW_ROUND_STATUS_RECOMMENDATIONS_READY,
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
										statusId:
											pkp.const.REVIEW_ROUND_STATUS_RECOMMENDATIONS_COMPLETED,
									}),
								],
							}),

							// REVIEW_ROUND_STATUS_RESUBMIT_FOR_REVIEW_SUBMITTED
							getSubmissionMock({
								publications: [
									getPublicationMock({
										authorsStringShort: '',
										fullTitle:
											'REVIEW_ROUND_STATUS_RESUBMIT_FOR_REVIEW_SUBMITTED',
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
										statusId:
											pkp.const
												.REVIEW_ROUND_STATUS_RESUBMIT_FOR_REVIEW_SUBMITTED,
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
						];

						return HttpResponse.json({
							itemsMax: 1,
							consts: pkp.const,
							items: submissions,
						});
					},
				),
			],
		},
	},
	args: PageInitConfigMock,
};
