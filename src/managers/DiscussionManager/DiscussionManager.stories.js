import {within, userEvent} from 'storybook/test';
import {http, HttpResponse} from 'msw';
import {useDate} from '@/composables/useDate';
import DiscussionManager from './DiscussionManager.vue';
import {DiscussionsDataMock} from '@/mockFactories/discussionMock';
import {TemplatesDataMock} from '@/mockFactories/taskDiscussionTemplates';
import {getSubmissionMock} from '@/mockFactories/submissionMock';
import {getParticipantMock} from '@/mockFactories/participantMock';
import {getFileMock} from '@/mockFactories/fileMock';

export default {
	title: 'Managers/DiscussionManager',
	component: DiscussionManager,
};

const baseArgs = {
	submission: getSubmissionMock({
		stages: [
			{
				id: pkp.const.WORKFLOW_STAGE_ID_SUBMISSION,
				isActiveStage: true,
				currentUserAssignedRoles: [16, 1],
			},
			{
				id: pkp.const.WORKFLOW_STAGE_ID_EXTERNAL_REVIEW,
				isActiveStage: false,
				currentUserAssignedRoles: [16, 1],
			},
			{
				id: pkp.const.WORKFLOW_STAGE_ID_EDITING,
				isActiveStage: false,
				currentUserAssignedRoles: [16, 1],
			},
			{
				id: pkp.const.WORKFLOW_STAGE_ID_PRODUCTION,
				isActiveStage: false,
				currentUserAssignedRoles: [16, 1],
			},
		],
	}),
	submissionStageId: pkp.const.WORKFLOW_STAGE_ID_SUBMISSION,
};

const {getRelativeTargetDate} = useDate();

const renderComponent = (args) => ({
	components: {DiscussionManager},
	setup() {
		return {args};
	},
	template: `<DiscussionManager v-bind="args" />`,
});

const mswHandlers = [
	http.get(
		'https://mock/index.php/publicknowledge/api/v1/submissions/19/stages/1/tasks',
		() => {
			return HttpResponse.json({
				items: DiscussionsDataMock,
				itemMax: DiscussionsDataMock.length,
			});
		},
	),
	http.get(
		'https://mock/index.php/publicknowledge/api/v1/submissions/19/participants/1',
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
	http.get(
		'https://mock/index.php/publicknowledge/api/v1/editTaskTemplates',
		() => {
			return HttpResponse.json({data: TemplatesDataMock});
		},
	),
	http.get(
		'https://mock/index.php/publicknowledge/api/v1/submissions/19/files',
		({request}) => {
			const Files = [
				getFileMock({
					id: 2,
					documentType: 'audio',
					name: 'document.mp3',
					genreName: 'Data Set',
					genreIsSupplementary: true,
				}),
				getFileMock({
					id: 5,
					documentType: 'html',
					name: 'document.html',
					genreName: 'Other',
					genreIsSupplementary: true,
				}),
				getFileMock({
					id: 6,
					documentType: 'image',
					name: 'document.png',
					genreName: 'Other',
					genreIsSupplementary: true,
				}),
				getFileMock({
					id: 7,
					documentType: 'pdf',
					name: 'document.pdf',
					genreName: 'Other',
					genreIsSupplementary: true,
				}),
			];

			return HttpResponse.json({
				itemsMax: Files.length,
				items: Files,
			});
		},
	),
];

DiscussionsDataMock.forEach((discussion) => {
	mswHandlers.push(
		http.get(
			`https://mock/index.php/publicknowledge/api/v1/submissions/19/tasks/${discussion.id}`,
			() => {
				return HttpResponse.json(discussion);
			},
		),
	);
});

TemplatesDataMock.forEach((template) => {
	mswHandlers.push(
		http.get(
			`https://mock/index.php/publicknowledge/api/v1/submissions/19/stages/1/tasks/fromTemplate/${template.id}`,
			() => {
				return HttpResponse.json({
					...template,
					dateDue: getRelativeTargetDate(template.dueInterval),
					participants: template.userGroups.filter(({id}) =>
						[2, 3, 5].includes(id),
					),
					notes: [{contents: template.description}],
				});
			},
		),
	);
});

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
