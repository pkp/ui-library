import ExamplePage from './ExamplePage.vue';
import SubmissionsMock from './mocks/submissions25';
import {rest} from 'msw';

const delay = (time) => new Promise((resolve) => setTimeout(resolve, time));

export default {
	title: 'Pages/Example',
	component: ExamplePage,
};

export const ExamplePage1 = {
	render: (args) => ({
		components: {ExamplePage},
		setup() {
			return {args};
		},
		template: '<ExamplePage v-bind="args" />',
	}),
	args: {
		pageInitConfig: {
			submissionsApiUrl:
				'https://mock/index.php/publicknowledge/api/v1/_submissions',
		},
	},
	parameters: {
		msw: {
			handlers: [
				rest.get(
					'https://mock/index.php/publicknowledge/api/v1/_submissions',
					async (req, res, ctx) => {
						await delay(500);

						return res(ctx.json(SubmissionsMock));
					},
				),
			],
		},
	},
};
