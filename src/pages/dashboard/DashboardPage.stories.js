import DashboardPage from './DashboardPage.vue';
import {http, HttpResponse} from 'msw';
import SubmissionsMock25 from './mocks/submissions25.js';
import PageInitConfigMock from './mocks/pageInitConfig.js';

import {EditorialActivityScenario} from './mocks/submissionScenariosMock';

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

export const ReviewRoundStatusesEditor = {
	parameters: {
		// mock date to consistently show sensible editorial activity popups
		date: new Date('February 20, 2024 10:00:00'),
		msw: {
			handlers: [
				http.get(
					'https://mock/index.php/publicknowledge/api/v1/_submissions/assigned',
					({request}) => {
						const submissions = EditorialActivityScenario;

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

export const ReviewRoundStatusesDecidingEditor = {
	parameters: {
		// mock date to consistently show sensible editorial activity popups
		date: new Date('February 20, 2024 10:00:00'),
		msw: {
			handlers: [
				http.get(
					'https://mock/index.php/publicknowledge/api/v1/_submissions/assigned',
					({request}) => {
						const submissions = JSON.parse(
							JSON.stringify(EditorialActivityScenario),
						);

						submissions.forEach((submission) => {
							submission.stages[1].currentUserDecidingEditor = true;
						});

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
