import {within, userEvent} from '@storybook/test';
import {http, HttpResponse} from 'msw';

import ReviewerSubmissionPage from './ReviewerSubmissionPage.vue';
import Review1Completed from './mocks/review1_completed.js';
import Review2Declined from './mocks/review2_declined.js';
import Review3Incomplete from './mocks/review3_incomplete.js';

import {allModes} from '../../../.storybook/modes.js';

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
				{
					submissionId: 16,
					reviewRoundId: 17,
					reviewRoundNumber: 3,
					submittedOn: '2024-02-08 12:51:12',
				},
			],
		},
	},
	parameters: {
		chromatic: {
			modes: {
				desktop: {disable: true},
				'desktop rtl': {disable: true},
				desktopLargeHeight: allModes['desktopLargeHeight'],
				'desktopLargeHeight rtl': allModes['desktopLargeHeight rtl'],
			},
		},
		msw: {
			handlers: [
				http.get(
					'https://mock/index.php/publicknowledge/api/v1/reviews/history/16/15',
					async (r) => {
						return HttpResponse.json(Review1Completed);
					},
				),
				http.get(
					'https://mock/index.php/publicknowledge/api/v1/reviews/history/16/16',
					async (r) => {
						return HttpResponse.json(Review2Declined);
					},
				),
				http.get(
					'https://mock/index.php/publicknowledge/api/v1/reviews/history/16/17',
					async (r) => {
						return HttpResponse.json(Review3Incomplete);
					},
				),
			],
		},
	},
};

export const Base = {};

export const OpenModalAccepted = {
	play: async ({canvasElement}) => {
		// Assigns canvas to the component root element
		const canvas = within(canvasElement);
		const user = userEvent.setup();

		await user.click(canvas.getByText('Read Round 1 Review'));
	},
	decorators: [
		() => ({
			template: '<div style="height: 1600px"><story/></div>',
		}),
	],
};

export const OpenModalDeclined = {
	play: async ({canvasElement}) => {
		// Assigns canvas to the component root element
		const canvas = within(canvasElement);
		const user = userEvent.setup();

		await user.click(canvas.getByText('Read Round 2 Review'));
	},
	decorators: [
		() => ({
			template: '<div style="height: 1600px"><story/></div>',
		}),
	],
};

export const OpenModalIncomplete = {
	play: async ({canvasElement}) => {
		// Assigns canvas to the component root element
		const canvas = within(canvasElement);
		const user = userEvent.setup();

		await user.click(canvas.getByText('Read Round 3 Review'));
	},
	decorators: [
		() => ({
			template: '<div style="height: 1600px"><story/></div>',
		}),
	],
};
