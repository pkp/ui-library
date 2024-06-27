import AcceptInvitationPage from './AcceptInvitationPage.vue';
import {http, HttpResponse} from 'msw';
import PageInitConfigMock from './mocks/pageInitConfig';
import invitationMock from './mocks/invitationMock';

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
				http.get(
					'https://mock/index.php/publicknowledge/api/v1/invitations/65/key/8aqc3W',
					async (r) => {
						return HttpResponse.json(invitationMock, {status: 200});
					},
				),
				http.post(
					'https://mock/index.php/publicknowledge/api/v1/invitations/65/key/8aqc3W/refine',
					async ({request}) => {
						const postBody = await request.json();
						let errors = {};

						if (!Object.keys(postBody).includes('username')) {
							errors['username'] = ['This field is required'];
						}
						if (!Object.keys(postBody).includes('password')) {
							errors['password'] = ['This field is required'];
						}
						if (!Object.keys(postBody).includes('affiliation')) {
							errors['affiliation'] = ['This field is required'];
						}
						if (!Object.keys(postBody).includes('country')) {
							errors['country'] = ['This field is required'];
						}
						Object.keys(postBody).forEach((element) => {
							if (element !== 'orcid') {
								if (postBody[element] === '') {
									errors[element] = ['This field is required'];
								}
							}
						});

						if (Object.keys(errors).length > 0) {
							return HttpResponse.json(errors, {status: 422});
						}
						return HttpResponse.json(postBody, {status: 200});
					},
				),
				http.post(
					'https://mock/index.php/publicknowledge/api/v1/invitations/65/key/8aqc3W/finalize',
					async (r) => {
						return HttpResponse.json(invitationMock, {status: 201});
					},
				),
			],
		},
	},
	args: PageInitConfigMock,
};
