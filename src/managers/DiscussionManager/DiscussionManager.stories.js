import {within, userEvent} from '@storybook/test';
import {http, HttpResponse} from 'msw';
import DiscussionManager from './DiscussionManager.vue';
import {DiscussionsDataMock} from '@/mockFactories/discussionMock';
import {TemplatesDataMock} from '@/mockFactories/taskDiscussionTemplates';
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

const mswHandlers = [
	http.get(
		'https://mock/index.php/publicknowledge/api/v1/submissions/19/participants/5',
		({request}) => {
			const participants = [
				getParticipantMock(),
				getParticipantMock({
					id: 4,
					fullName: 'Andy Author',
					userName: 'aauthor',
					stageAssignments: [
						{
							stageAssignmentStageId: pkp.const.WORKFLOW_STAGE_ID_PRODUCTION,
							stageAssignmentUserGroup: {
								name: 'Author',
								roleId: 65536,
							},
						},
					],
				}),
				getParticipantMock({
					id: 5,
					fullName: 'Kaja Karina',
					userName: 'kakarina',
				}),
			];
			return HttpResponse.json(participants);
		},
	),
	http.get('https://mock/index.php/publicknowledge/api/v1/templates', () => {
		return HttpResponse.json(TemplatesDataMock);
	}),
];

export const Default = {
	render: renderComponent,
	args: baseArgs,
	parameters: {
		msw: {
			handlers: mswHandlers,
		},
	},
};

export const AddForm = {
	render: renderComponent,
	args: baseArgs,
	parameters: {
		msw: {
			handlers: mswHandlers,
		},
	},
	play: async ({canvasElement}) => {
		// Assigns canvas to the component root element
		const canvas = within(canvasElement);
		const user = userEvent.setup();

		await user.click(canvas.getByText('Add'));
	},
};
