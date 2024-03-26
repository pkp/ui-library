import UserInvitationPage from './UserInvitationPage.vue';
import {http, HttpResponse} from 'msw';
import userMock from './mocks/userMock.js';
import PageInitConfigMock from './mocks/pageInitConfig';

export default {title: 'Pages/UserInvitation', component: UserInvitationPage};

export const Init = {
	render: (args) => ({
		components: {UserInvitationPage},
		setup() {
			return {args};
		},
		template: '<UserInvitationPage v-bind="args" />',
	}),
	parameters: {
		msw: {
			handlers: [
				http.get('https://mock/index.php/publicknowledge/api/v1/_user', () => {
					return HttpResponse.json(userMock);
				}),
				http.post(
					'https://mock/index.php/publicknowledge/api/v1/user/_invite',
					() => {
						return HttpResponse.json('invitation send successfully');
					},
				),
			],
		},
	},
	args: PageInitConfigMock,
};
