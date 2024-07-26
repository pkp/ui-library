import InvitationManager from './InvitationManager.vue';
import {http, HttpResponse} from 'msw';
import {page1, page2} from './mocks/invitationMock.js';

export default {
	title: 'Managers/InvitationManager',
	component: InvitationManager,
};

export const Init = {
	render: (args) => ({
		components: {InvitationManager},
		setup() {
			return {args};
		},
		template: '<InvitationManager/>',
	}),
	parameters: {
		msw: {
			handlers: [
				http.get(
					'https://mock/index.php/publicknowledge/api/v1/invitations',
					async ({request}) => {
						const url = new URL(request.url);
						let page = parseInt(url.searchParams.get('page'));
						if (page === 1) {
							return HttpResponse.json(page1, {status: 200});
						} else {
							return HttpResponse.json(page2, {status: 200});
						}
					},
				),
			],
		},
	},
	args: [],
};
