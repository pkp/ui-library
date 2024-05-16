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
				http.get(
					'https://mock/index.php/publicknowledge/api/v1/_user',
					({request}) => {
						const url = new URL(request.url);
						let params = new URLSearchParams(url.search);

						// To store the parameters in a simple object
						let allParams = {};
						for (let param of params) {
							allParams[param[0]] = param[1];
						}
						console.log(allParams);
						if (
							allParams.searchPhrase.replaceAll(/\s/g, '') ===
							'carlo@mailinator.com'
						) {
							return HttpResponse.json(userMock);
						} else {
							return HttpResponse.json({
								itemsMax: 0,
								items: [],
							});
						}
					},
				),
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
