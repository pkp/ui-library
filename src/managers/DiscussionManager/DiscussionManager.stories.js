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
			const FILE_STAGES_MOCK = {
				[pkp.const.SUBMISSION_FILE_SUBMISSION]: [
					getFileMock({
						id: 1,
						documentType: 'pdf',
						name: 'Research_Study_001.pdf',
						genreName: 'Manuscript',
						genreIsSupplementary: false,
					}),
					getFileMock({
						id: 2,
						documentType: 'pdf',
						name: 'Supplementary_Data_002.pdf',
						genreName: 'Data Set',
						genreIsSupplementary: true,
					}),
				],
				[pkp.const.SUBMISSION_FILE_INTERNAL_REVIEW_FILE]: [
					getFileMock({
						id: 3,
						documentType: 'pdf',
						name: 'Internal_Review_003.pdf',
						genreName: 'Review',
						genreIsSupplementary: false,
					}),
				],
				[pkp.const.SUBMISSION_FILE_REVIEW_FILE]: [
					getFileMock({
						id: 4,
						documentType: 'pdf',
						name: 'Peer_Review_004.pdf',
						genreName: 'Review',
						genreIsSupplementary: false,
					}),
					getFileMock({
						id: 5,
						documentType: 'image',
						name: 'Review_Figure_005.png',
						genreName: 'Figures',
						genreIsSupplementary: true,
					}),
				],
				[pkp.const.SUBMISSION_FILE_REVIEW_REVISION]: [
					getFileMock({
						id: 6,
						documentType: 'pdf',
						name: 'Revised_Manuscript_006.pdf',
						genreName: 'Manuscript',
						genreIsSupplementary: false,
					}),
					getFileMock({
						id: 7,
						documentType: 'pdf',
						name: 'Response_to_Reviewers_007.pdf',
						genreName: 'Other',
						genreIsSupplementary: true,
					}),
				],
				[pkp.const.SUBMISSION_FILE_COPYEDIT]: [
					getFileMock({
						id: 8,
						documentType: 'pdf',
						name: 'Copyedit_Draft_008.pdf',
						genreName: 'Copyedit',
						genreIsSupplementary: false,
					}),
					getFileMock({
						id: 9,
						documentType: 'html',
						name: 'Copyedit_Preview_009.html',
						genreName: 'Other',
						genreIsSupplementary: true,
					}),
				],
				[pkp.const.SUBMISSION_FILE_FINAL]: [
					getFileMock({
						id: 10,
						documentType: 'pdf',
						name: 'Final_Version_010.pdf',
						genreName: 'Final',
						genreIsSupplementary: false,
					}),
				],
				[pkp.const.SUBMISSION_FILE_PRODUCTION_READY]: [
					getFileMock({
						id: 11,
						documentType: 'pdf',
						name: 'Production_Ready_011.pdf',
						genreName: 'Production',
						genreIsSupplementary: false,
					}),
					getFileMock({
						id: 12,
						documentType: 'pdf',
						name: 'Proof_012.pdf',
						genreName: 'Proof',
						genreIsSupplementary: true,
					}),
				],
			};

			const url = new URL(request.url);
			const fileStageId = parseInt(url.searchParams.get('fileStages'));

			const Files = FILE_STAGES_MOCK[fileStageId];

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
