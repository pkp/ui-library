import AcceptInvitationPage from './AcceptInvitationPage.vue';
import {http, HttpResponse} from 'msw';
import PageInitConfigMock from './mocks/pageInitConfig';

export default {
	title: 'Pages/AcceptInvitation',
	component: AcceptInvitationPage,
};

export const Init = {
	render: (args) => ({
		components: {AcceptInvitationPage},
		setup() {
			return {args};
		},
		template: '<AcceptInvitationPage v-bind="args" />',
	}),
	parameters: {
		msw: {
			handlers: [
				http.post('https://mock/index.php/publicknowledge/api/v1/users', () => {
					return HttpResponse.json('accept invitation successfully');
				}),
			],
		},
	},
	args: PageInitConfigMock,
};
