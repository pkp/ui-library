import SubmissionsPage from './SubmissionsPage.vue';
import {http, HttpResponse} from 'msw';
import SubmissionsMock25 from './mocks/submissions25.js';
import PageInitConfigMock from './mocks/pageInitConfig';

export default {title: 'Pages/Submissions', component: SubmissionsPage};

export const Init = {
	render: (args) => ({
		components: {SubmissionsPage},
		setup() {
			return {args};
		},
		template: '<SubmissionsPage v-bind="args" />',
	}),
	parameters: {
		msw: {
			handlers: [
				http.get(
					'https://mock/index.php/publicknowledge/api/v1/_submissions',
					() => {
						return HttpResponse.json(SubmissionsMock25);
					},
				),
				http.get(
					'https://mock/index.php/publicknowledge/api/v1/_submissions/assigned',
					() => {
						return HttpResponse.json(SubmissionsMock25);
					},
				),
			],
		},
	},
	args: PageInitConfigMock,
};
