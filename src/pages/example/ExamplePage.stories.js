import ExamplePage from './ExamplePage.vue';
import SubmissionsMock from './mocks/submissions25';
import {http, HttpResponse, delay} from 'msw';

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
		template: '<ExamplePage v-bind="args.pageInitConfig" />',
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
				http.get(
					'https://mock/index.php/publicknowledge/api/v1/_submissions',
					async (r) => {
						await delay(500);

						return HttpResponse.json(SubmissionsMock);
					},
				),
			],
		},
	},
};
