import InvitationManager from './InvitationManager.vue';
import {http, HttpResponse} from 'msw';
import invitationMock from './mocks/invitationMock.js';

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
		template: '<InvitationManager v-bind="args"/>',
	}),
	parameters: {
		msw: {
			handlers: [
				http.get(
					'https://mock/index.php/publicknowledge/api/v1/invitations',
					async ({request}) => {
						const url = new URL(request.url);
						const offset = parseInt(url.searchParams.get('offset') || 0);
						const count = parseInt(url.searchParams.get('count'));
						const invitations = invitationMock.items.slice(
							offset,
							offset + count,
						);

						return HttpResponse.json({
							itemsMax: invitationMock.itemsMax,
							items: invitations,
						});
					},
				),
			],
		},
	},
	args: [],
};
