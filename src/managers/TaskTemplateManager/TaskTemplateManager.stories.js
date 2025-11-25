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

	http.get('https://mock/index.php/publicknowledge/api/v1/userGroups', () => {
		return HttpResponse.json(UserGroupMock);
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
