import '@/styles/frontend-theme.css';
import PkpOpenReviewSummary from '../PkpOpenReviewSummary.vue';
import {
	mockPublicationsPeerReviews,
	mockSubmissionPeerReviewSummary,
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

export const Default = {
	args: {
		publicationsPeerReviews: mockPublicationsPeerReviews,
		submissionPeerReviewSummary: mockSubmissionPeerReviewSummary,
	},
};
