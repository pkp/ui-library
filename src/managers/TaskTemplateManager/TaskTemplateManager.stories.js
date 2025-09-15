import {http, HttpResponse} from 'msw';
import TaskTemplateManager from './TaskTemplateManager.vue';
import {
	TemplatesDataMock,
	getTemplate,
} from '@/mockFactories/taskDiscussionTemplates';

export default {
	title: 'Managers/TaskTemplateManager',
	component: TaskTemplateManager,
};

const baseArgs = {
	templates: [
		...TemplatesDataMock,
		getTemplate({name: 'Ethical Approval', stageId: 'Submission'}),
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
