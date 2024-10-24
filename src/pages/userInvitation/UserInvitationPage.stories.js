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
					'https://mock/index.php/publicknowledge/api/v1/users',
					({request}) => {
						const url = new URL(request.url);
						let params = new URLSearchParams(url.search);

						// To store the parameters in a simple object
						let allParams = {};
						for (let param of params) {
							allParams[param[0]] = param[1];
						}
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
					'https://mock/index.php/publicknowledge/api/v1/invitations/add/userRoleAssignment',
					() => {
						return HttpResponse.json({invitationId: 15});
					},
				),
				http.post(
					'https://mock/index.php/publicknowledge/api/v1/invitations/15/populate',
					async ({request}) => {
						const data = await request.json();
						let errors = {};

						data.invitationData.userGroupsToAdd.forEach((element, index) => {
							Object.keys(element).forEach((key) => {
								if (element[key] === null) {
									errors = {
										...errors,
										['userGroupsToAdd.' + index + '.' + key]: [
											'This field is required',
										],
									};
								}
							});
						});

						if (data.invitationData.email === '') {
							errors['email'] = ['This field is required'];
						}
						if (data.invitationData.familyName === '') {
							errors['familyName'] = ['This field is required'];
						}
						if (data.invitationData.givenName === '') {
							errors['givenName'] = ['This field is required'];
						}

						if (data.invitationData.emailComposer) {
							Object.keys(data.invitationData.emailComposer).forEach(
								(element) => {
									if (data.invitationData.emailComposer[element] === '') {
										errors['emailComposer'] = {
											...errors['emailComposer'],
											[element]: ['This field is required'],
										};
									}
								},
							);
						}

						if (Object.keys(errors).length > 0) {
							return HttpResponse.json({errors: errors}, {status: 422});
						}

						return HttpResponse.json({status: 201});
					},
				),
				http.post(
					'https://mock/index.php/publicknowledge/api/v1/invitations/15/invite',
					() => {
						return HttpResponse.json({});
					},
				),
				http.post(
					'https://mock/index.php/publicknowledge/api/v1/user/_invite',
					() => {
						return HttpResponse.json('invitation send successfully');
					},
				),
				http.post(
					'https://mock/index.php/publicknowledge/api/v1/users/35/roles/17',
					() => {
						return HttpResponse.json('role remove successfully');
					},
				),
			],
		},
	},
	args: PageInitConfigMock,
};
