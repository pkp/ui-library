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
						const participants = [
							getParticipantMock(),
							getParticipantMock({
								id: 4,
								fullName: 'Andy Author',
								userName: 'aauthor',
								stageAssignments: [
									{
										stageAssignmentStageId:
											pkp.const.WORKFLOW_STAGE_ID_PRODUCTION,
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
				http.get(
					'https://mock/index.php/publicknowledge/api/v1/templates',
					() => {
						return HttpResponse.json([
							{
								id: 1,
								name: 'Template 1',
								description: 'Description 1',
								content: 'Content 1',
								isTask: true,
								taskDetails: {
									participantRoles: [16, 1],
									dueDate: 'P1W',
								},
							},
							{
								id: 2,
								name: 'Template 2',
								description: 'Description 2',
								content: 'Content 2',
								isTask: false,
							},
							{
								id: 3,
								name: 'Template 3',
								description: 'Description 3',
								content: 'Content 3',
								isTask: true,
								taskDetails: {
									participantRoles: [65536],
									dueDate: 'P3M',
								},
							},
						]);
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
