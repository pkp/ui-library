import {within, userEvent} from 'storybook/test';
import {http, HttpResponse} from 'msw';
import TaskTemplateManager from './TaskTemplateManager.vue';
import {TemplatesDataMock} from '@/mockFactories/taskDiscussionTemplates';
import {emailTemplateMock} from '@/mockFactories/emailTemplateMock';
import {UserGroupMock} from '@/mockFactories/userGroupMock';

export default {
	title: 'Managers/TaskTemplateManager',
	component: TaskTemplateManager,
};

const baseArgs = {
	templates: TemplatesDataMock,
};

const renderComponent = (args) => ({
	components: {TaskTemplateManager},
	setup() {
		return {args};
	},
	template: `<TaskTemplateManager v-bind="args" />`,
});

const mswHandlers = [
	http.get(
		'https://mock/index.php/publicknowledge/api/v1/editTaskTemplates',
		() => {
			return HttpResponse.json({data: baseArgs.templates});
		},
	),
	http.get(
		'https://mock/index.php/publicknowledge/api/v1/mailables/DISCUSSION_NOTIFICATION_SUBMISSION',
		() => {
			return HttpResponse.json(
				emailTemplateMock['DISCUSSION_NOTIFICATION_SUBMISSION'],
			);
		},
	),
	http.get(
		'https://mock/index.php/publicknowledge/api/v1/mailables/DISCUSSION_NOTIFICATION_REVIEW',
		() => {
			return HttpResponse.json(
				emailTemplateMock['DISCUSSION_NOTIFICATION_REVIEW'],
			);
		},
	),
	http.get(
		'https://mock/index.php/publicknowledge/api/v1/mailables/DISCUSSION_NOTIFICATION_COPYEDITING',
		() => {
			return HttpResponse.json(
				emailTemplateMock['DISCUSSION_NOTIFICATION_COPYEDITING'],
			);
		},
	),

	http.get(
		'https://mock/index.php/publicknowledge/api/v1/mailables/DISCUSSION_NOTIFICATION_PRODUCTION',
		() => {
			return HttpResponse.json(
				emailTemplateMock['DISCUSSION_NOTIFICATION_PRODUCTION'],
			);
		},
	),

	http.get(
		'https://mock/index.php/publicknowledge/api/v1/userGroups',
		({request}) => {
			const url = new URL(request.url);
			const stageId = url.searchParams.get('stageIds');
			switch (stageId) {
				case '1':
					return HttpResponse.json({
						items: UserGroupMock.WORKFLOW_STAGE_ID_SUBMISSION,
						itemsMax: UserGroupMock.WORKFLOW_STAGE_ID_SUBMISSION.length,
					});
				case '3':
					return HttpResponse.json({
						items: UserGroupMock.WORKFLOW_STAGE_ID_EXTERNAL_REVIEW,
						itemsMax: UserGroupMock.WORKFLOW_STAGE_ID_EXTERNAL_REVIEW.length,
					});
				case '4':
					return HttpResponse.json({
						items: UserGroupMock.WORKFLOW_STAGE_ID_EDITING,
						itemsMax: UserGroupMock.WORKFLOW_STAGE_ID_EDITING.length,
					});
				case '5':
					return HttpResponse.json({
						items: UserGroupMock.WORKFLOW_STAGE_ID_PRODUCTION,
						itemsMax: UserGroupMock.WORKFLOW_STAGE_ID_PRODUCTION.length,
					});
				default:
					return HttpResponse.json({
						items: [],
						itemsMax: 0,
					});
			}
		},
	),
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

export const AddNewTemplate = {
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

		await user.click(
			within(canvas.getByText('Submission Stage').closest('th')).getByText(
				'Add template',
			),
		);
	},
};
