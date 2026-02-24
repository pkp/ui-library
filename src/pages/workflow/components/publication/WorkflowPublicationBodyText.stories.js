import {http, HttpResponse} from 'msw';
import WorkflowPublicationBodyText from './WorkflowPublicationBodyText.vue';
import pageInitConfigEditorial from '@/pages/dashboard/mocks/pageInitConfigEditorial';
import {getSubmissionMock} from '@/mockFactories/submissionMock';
import {getPublicationMock} from '@/mockFactories/publicationMock';
import {useWorkflowStore} from '@/pages/workflow/workflowStore';
import {useWorkflowConfigOJS as useWorkflowConfig} from '@/pages/workflow/composables/useWorkflowConfig/useWorkflowConfigOJS';
import {useWorkflowNavigationConfigOJS as useWorkflowNavigationConfig} from '@/pages/workflow/composables/useWorkflowNavigationConfig/useWorkflowNavigationConfigOJS';

const submissionId = 19;
const publicationId = 20;

const documentContent = {
	type: 'doc',
	content: [
		{
			type: 'paragraph',
			content: [
				{
					type: 'text',
					text: 'This is sample body text loaded from the API for Storybook.',
				},
			],
		},
	],
};

const bodyTextResponse = {
	id: 901,
	bodyTextContent: documentContent,
	dependentFiles: [],
};

export default {
	title: 'Pages/Workflow/Components/WorkflowPublicationBodyText',
	component: WorkflowPublicationBodyText,
	parameters: {
		msw: {
			handlers: [
				http.get(
					'https://mock/index.php/publicknowledge/api/v1/submissions/19',
					() =>
						HttpResponse.json(
							getSubmissionMock({
								id: submissionId,
								currentPublicationId: publicationId,
							}),
						),
				),
				http.get(
					'https://mock/index.php/publicknowledge/api/v1/submissions/19/publications/20',
					() =>
						HttpResponse.json(
							getPublicationMock({
								id: publicationId,
								submissionId,
								citations: [],
							}),
						),
				),
				http.get(
					'https://mock/index.php/publicknowledge/api/v1/submissions/19/publications/20/bodyText',
					() => HttpResponse.json(bodyTextResponse),
				),
				http.put(
					'https://mock/index.php/publicknowledge/api/v1/submissions/19/publications/20/bodyText',
					() => HttpResponse.json(bodyTextResponse),
				),
				http.post(
					'https://mock/index.php/publicknowledge/api/v1/submissions/19/files',
					() =>
						HttpResponse.json({
							id: 3001,
							url: 'https://mock/index.php/publicknowledge/files/3001',
						}),
				),
			],
		},
	},
	decorators: [
		() => ({
			template: '<div style="height: 900px; overflow: auto"><story /></div>',
		}),
	],
};

export const Default = {
	args: {
		submission: getSubmissionMock({
			id: submissionId,
			currentPublicationId: publicationId,
		}),
		publication: getPublicationMock({
			id: publicationId,
			submissionId,
			citations: [],
		}),
		pageInitConfig: pageInitConfigEditorial,
	},
	render: (args) => ({
		components: {WorkflowPublicationBodyText},
		setup() {
			// Initialize the workflow component store expected by the body text component.
			useWorkflowStore({
				props: {
					submissionId: args.submission.id,
					pageInitConfig: args.pageInitConfig,
				},
				Components: {
					WorkflowPublicationBodyText,
				},
				useWorkflowConfig,
				useWorkflowNavigationConfig,
			});
			return {args};
		},
		template:
			'<WorkflowPublicationBodyText :submission="args.submission" :publication="args.publication" />',
	}),
};
