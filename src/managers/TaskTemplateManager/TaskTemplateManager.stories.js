import {within, userEvent} from 'storybook/test';
import {http, HttpResponse} from 'msw';
import TaskTemplateManager from './TaskTemplateManager.vue';
import {
	TemplatesDataMock,
	getTemplate,
} from '@/mockFactories/taskDiscussionTemplates';
import {emailTemplateMock} from '@/mockFactories/emailTemplateMock';

export default {
	title: 'Managers/TaskTemplateManager',
	component: TaskTemplateManager,
};

const baseArgs = {
	templates: [
		...TemplatesDataMock,
		getTemplate({
			id: 4,
			title: 'Ethical Approval',
			stageId: 1,
			userGroups: [{id: 65536}],
			dueDate: 'P3M',
		}),
		getTemplate({
			id: 5,
			title: 'Adherence to Policy and Guidelines',
			stageId: 1,
			include: false,
		}),
		getTemplate({id: 6, title: 'Language Review', stageId: 1}),
		getTemplate({
			id: 7,
			title: 'Analysis of the Method',
			stageId: 1,
			include: false,
		}),
		getTemplate({
			id: 8,
			title: 'Lorem ipsum dolor sit amet',
			stageId: 3,
		}),
		getTemplate({
			id: 9,
			title: 'Consectetur adipiscing elit',
			stageId: 3,
			include: false,
		}),
		getTemplate({
			id: 10,
			title: 'Sed do eiusmod tempor incididunt ut',
			stageId: 4,
			include: false,
		}),
		getTemplate({
			id: 11,
			title: 'labore et dolore magna aliqua',
			stageId: 5,
		}),
		getTemplate({
			id: 12,
			title: 'Ut enim ad minim veniam',
			stageId: 5,
			include: false,
		}),
		getTemplate({
			id: 13,
			title: 'Quis nostrud exercitation ullamco',
			stageId: 5,
			include: false,
		}),
	],
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
			return HttpResponse.json(baseArgs.templates);
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
