import {within, userEvent} from '@storybook/test';
import {http, HttpResponse} from 'msw';
import DiscussionManager from './DiscussionManager.vue';
import {DiscussionsDataMock} from '@/mockFactories/discussionMock';
import {getSubmissionMock} from '@/mockFactories/submissionMock';
import {getParticipantMock} from '@/mockFactories/participantMock';

export default {
	title: 'Managers/DiscussionManager',
	component: DiscussionManager,
};

const baseArgs = {
	submission: getSubmissionMock({
		stages: [
			{
				id: pkp.const.WORKFLOW_STAGE_ID_PRODUCTION,
				currentUserAssignedRoles: [16, 1],
			},
		],
	}),
	submissionStageId: pkp.const.WORKFLOW_STAGE_ID_PRODUCTION,
	discussions: DiscussionsDataMock,
};

const renderComponent = (args) => ({
	components: {DiscussionManager},
	setup() {
		return {args};
	},
	template: `<DiscussionManager v-bind="args" />`,
});

export const Default = {
	render: renderComponent,
	args: baseArgs,
};

export const AddForm = {
	render: renderComponent,
	args: baseArgs,
	parameters: {
		msw: {
			handlers: [
				http.get(
					'https://mock/index.php/publicknowledge/api/v1/submissions/19/participants/5',
					({request}) => {
						return HttpResponse.json([getParticipantMock()]);
					},
				),
			],
		},
	},
	play: async ({canvasElement}) => {
		// Assigns canvas to the component root element
		const canvas = within(canvasElement);
		const user = userEvent.setup();

		await user.click(canvas.getByText('Add'));
	},
};
