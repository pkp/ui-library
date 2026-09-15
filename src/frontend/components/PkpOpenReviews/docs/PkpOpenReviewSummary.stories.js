import '@/styles/frontend-theme.css';
import PkpOpenReviewsSummary from '../PkpOpenReviewsSummary.vue';
import {
	mockSubmissionPeerReviews,
	mockSubmissionPeerReviewSummary,
	mockSubmissionPeerReviewSummaryInProgress,
	mockSubmissionPeerReviewSummaryNotAvailable,
} from './mockOpenReviewData.js';

export default {
	title: 'Frontend/PkpOpenReviews/Summary',
	component: PkpOpenReviewsSummary,
	render: (args) => ({
		components: {PkpOpenReviewsSummary},
		setup() {
			return {args};
		},
		template: '<PkpOpenReviewsSummary v-bind="args" />',
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
