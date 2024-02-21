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
