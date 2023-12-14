import SubmissionsPage from './SubmissionsPage.vue';
import {rest} from 'msw';
import SubmissionsMock25 from './mocks/submissions25.js';
import PageInitConfigMock from './mocks/pageInitConfig';

export default {title: 'Pages/Submissions', component: SubmissionsPage};

export const init = {
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
				rest.get(
					'https://mock/index.php/publicknowledge/api/v1/_submissions',
					(req, res, ctx) => {
						return res(ctx.json(SubmissionsMock25));
					},
				),
			],
		},
	},
	args: PageInitConfigMock,
};
