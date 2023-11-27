import ExamplePage from './ExamplePage.vue';
import SubmissionsMock from './mocks/submissions25';
export default {
	title: 'Pages/Example',
	component: ExamplePage,
};

export const Default = {
	render: (args) => ({
		components: {ExamplePage},
		setup() {
			return {args};
		},
		template: '<ExamplePage v-bind="args" />',
	}),
	args: {
		pageServerConfig: {
			submissionsApiUrl:
				'http://localhost/index.php/publicknowledge/api/v1/_submissions',
		},
	},
	parameters: {
		mockData: [
			{
				url: 'http://localhost/index.php/publicknowledge/api/v1/_submissions?offset=0&count=20',
				method: 'GET',
				status: 200,
				response: SubmissionsMock,
			},
		],
	},
};
