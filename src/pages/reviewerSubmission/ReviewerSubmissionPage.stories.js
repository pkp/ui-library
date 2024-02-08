import {within, userEvent} from '@storybook/testing-library';
import {http, HttpResponse} from 'msw';

import ReviewerSubmissionPage from './ReviewerSubmissionPage.vue';
import Review1Mock from './mocks/review1';
import Review2Mock from './mocks/review2';

export default {
	title: 'Pages/ReviewerSubmission',
	component: ReviewerSubmissionPage,
	render: (args) => ({
		components: {ReviewerSubmissionPage},
		setup() {
			return {args};
		},
		template: '<ReviewerSubmissionPage v-bind="args.pageInitConfig" />',
	}),
	args: {
		pageInitConfig: {
			reviewRoundHistories: [
				{
					submissionId: 16,
					reviewRoundId: 15,
					reviewRoundNumber: 1,
					submittedOn: '2024-02-08 12:45:38',
				},
				{
					submissionId: 16,
					reviewRoundId: 16,
					reviewRoundNumber: 2,
					submittedOn: '2024-02-08 12:51:12',
				},
			],
		},
	},
	parameters: {
		msw: {
			handlers: [
				http.get(
					'https://mock/index.php/publicknowledge/api/v1/reviews/history/16/15',
					async (r) => {
						return HttpResponse.json(Review1Mock);
					},
				),
				http.get(
					'https://mock/index.php/publicknowledge/api/v1/reviews/history/16/16',
					async (r) => {
						return HttpResponse.json(Review2Mock);
					},
				),
			],
		},
	},
};

export const Base = {};

export const OpenModal = {
	play: async ({canvasElement}) => {
		// Assigns canvas to the component root element
		const canvas = within(canvasElement);
		const user = userEvent.setup();

		await user.click(canvas.getByText('Read Round 2 Review'));
	},
};
