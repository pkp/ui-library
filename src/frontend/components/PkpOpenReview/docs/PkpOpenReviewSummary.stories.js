import '@/styles/frontend-theme.css';
import PkpOpenReviewSummary from '../PkpOpenReviewSummary.vue';
import {
	mockPublicationsPeerReviews,
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
		publicationsPeerReviews: mockPublicationsPeerReviews,
		submissionPeerReviewSummary: mockSubmissionPeerReviewSummary,
	},
};

export const InProgress = {
	args: {
		publicationsPeerReviews: mockPublicationsPeerReviews,
		submissionPeerReviewSummary: mockSubmissionPeerReviewSummaryInProgress,
	},
};

export const InProgressNoReports = {
	args: {
		publicationsPeerReviews: mockPublicationsPeerReviews,
		submissionPeerReviewSummary: {
			...mockSubmissionPeerReviewSummaryInProgress,
			reviewerCount: 0,
			reviewerRecommendations: [],
		},
	},
};

export const NotAvailable = {
	args: {
		publicationsPeerReviews: [],
		submissionPeerReviewSummary: mockSubmissionPeerReviewSummaryNotAvailable,
	},
};
