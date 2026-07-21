import '@/styles/frontend-theme.css';
import PkpOpenReviewSummary from '../PkpOpenReviewSummary.vue';
import {
	mockSubmissionPeerReviews,
	mockSubmissionPeerReviewSummary,
	mockSubmissionPeerReviewSummaryInProgress,
	mockSubmissionPeerReviewSummaryNotAvailable,
} from './mockOpenReviewData.js';

export default {
	title: 'Frontend/PkpOpenReview/Summary',
	component: PkpOpenReviewSummary,
	render: (args) => ({
		components: {PkpOpenReviewSummary},
		setup() {
			return {args};
		},
		template: '<PkpOpenReviewSummary v-bind="args" />',
	}),
};

export const Completed = {
	args: {
		submissionPeerReviews: mockSubmissionPeerReviews,
		submissionPeerReviewSummary: mockSubmissionPeerReviewSummary,
	},
};

export const InProgress = {
	args: {
		submissionPeerReviews: mockSubmissionPeerReviews,
		submissionPeerReviewSummary: mockSubmissionPeerReviewSummaryInProgress,
	},
};

export const InProgressNoReports = {
	args: {
		submissionPeerReviews: mockSubmissionPeerReviews,
		submissionPeerReviewSummary: {
			...mockSubmissionPeerReviewSummaryInProgress,
			reviewerCount: 0,
			reviewerRecommendations: [],
		},
	},
};

export const NotAvailable = {
	args: {
		submissionPeerReviews: {submissionId: 5, reviewRounds: []},
		submissionPeerReviewSummary: mockSubmissionPeerReviewSummaryNotAvailable,
	},
};
