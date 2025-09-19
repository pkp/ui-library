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
			name: 'Ethical Approval',
			stageId: 'Submission',
			participantRoles: [65536],
			dueDate: 'P3M',
		}),
		getTemplate({
			id: 5,
			name: 'Adherence to Policy and Guidelines',
			stageId: 'Submission',
			autoAdd: false,
		}),
		getTemplate({id: 6, name: 'Language Review', stageId: 'Submission'}),
		getTemplate({
			id: 7,
			name: 'Analysis of the Method',
			stageId: 'Submission',
			autoAdd: false,
		}),
		getTemplate({id: 8, name: 'Lorem ipsum dolor sit amet', stageId: 'Review'}),
		getTemplate({
			id: 9,
			name: 'Consectetur adipiscing elit',
			stageId: 'Review',
			autoAdd: false,
		}),
		getTemplate({
			id: 10,
			name: 'Sed do eiusmod tempor incididunt ut',
			stageId: 'Copyediting',
			autoAdd: false,
		}),
		getTemplate({
			id: 11,
			name: 'labore et dolore magna aliqua',
			stageId: 'Production',
		}),
		getTemplate({
			id: 12,
			name: 'Ut enim ad minim veniam',
			stageId: 'Production',
			autoAdd: false,
		}),
		getTemplate({
			id: 13,
			name: 'Quis nostrud exercitation ullamco',
			stageId: 'Production',
			autoAdd: false,
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
	http.get('https://mock/index.php/publicknowledge/api/v1/templates', () => {
		return HttpResponse.json(baseArgs.templates);
	}),
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
