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
			name: 'Ethical Approval',
			stageId: 'Submission',
			participantRoles: [65536],
			dueDate: 'P3M',
		}),
		getTemplate({
			name: 'Adherence to Policy and Guidelines',
			stageId: 'Submission',
			autoAdd: false,
		}),
		getTemplate({name: 'Language Review', stageId: 'Submission'}),
		getTemplate({
			name: 'Analysis of the Method',
			stageId: 'Submission',
			autoAdd: false,
		}),
		getTemplate({name: 'Lorem ipsum dolor sit amet', stageId: 'Review'}),
		getTemplate({
			name: 'Consectetur adipiscing elit',
			stageId: 'Review',
			autoAdd: false,
		}),
		getTemplate({
			name: 'Sed do eiusmod tempor incididunt ut',
			stageId: 'Copyediting',
			autoAdd: false,
		}),
		getTemplate({
			name: 'labore et dolore magna aliqua',
			stageId: 'Production',
		}),
		getTemplate({
			name: 'Ut enim ad minim veniam',
			stageId: 'Production',
			autoAdd: false,
		}),
		getTemplate({
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
