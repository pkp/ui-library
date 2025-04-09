import WorkflowPage from './WorkflowPageOJS.vue';
import {http, HttpResponse} from 'msw';
import pageInitConfigEditorial from '../dashboard/mocks/pageInitConfigEditorial';
import {useModal} from '@/composables/useModal';
import {within, userEvent} from '@storybook/test';

import {getSubmissionMock} from '@/mockFactories/submissionMock';
import {getPublicationMock} from '@/mockFactories/publicationMock';
import {getParticipantMock} from '@/mockFactories/participantMock';

export default {
	title: 'Pages/Workflow',
	component: WorkflowPage,
	parameters: {
		date: new Date('February 20, 2024 10:00:00'),
	},
};

export const Default = {
	parameters: {
		// mock date to consistently show sensible editorial activity popups
		msw: {
			handlers: [
				http.get(
					'https://mock/index.php/publicknowledge/api/v1/submissions/19',
					({request}) => {
						return HttpResponse.json(
							getSubmissionMock({
								stages: [
									{
										id: pkp.const.WORKFLOW_STAGE_ID_SUBMISSION,
										currentUserAssignedRoles: [16, 1],
									},
								],
							}),
						);
					},
				),
				http.get(
					'https://mock/index.php/publicknowledge/api/v1/submissions/19/publications/20',
					({request}) => {
						return HttpResponse.json(getPublicationMock());
					},
				),
				http.get(
					'https://mock/index.php/publicknowledge/api/v1/submissions/19/participants/1',
					({request}) => {
						return HttpResponse.json([getParticipantMock()]);
					},
				),
				http.get(
					'https://mock/index.php/publicknowledge/api/v1/submissions/19/files',
					({request}) => {
						return HttpResponse.json({itemsMax: 0, items: []});
					},
				),
				http.get(
					'https://mock/index.php/publicknowledge/$$$call$$$/grid/queries/queries-grid/fetch-grid',
					({request}) => {
						return HttpResponse.json({
							content: '',
							status: true,
							events: [],
							elementId: '0',
						});
					},
				),
			],
		},
	},
	render: (args) => ({
		components: {WorkflowPage},
		setup() {
			const {openSideModal} = useModal();

			function openWorkflowPage() {
				openSideModal(WorkflowPage, {
					submissionId: 19,
					pageInitConfig: args.pageInitConfig,
				});
			}
			return {args, openWorkflowPage};
		},
		template: `
		    <button @click="openWorkflowPage">View</button>
        `,
	}),
	decorators: [
		() => ({
			template: '<div style="height: 900px"><story/></div>',
		}),
	],
	args: {pageInitConfig: pageInitConfigEditorial},
	play: async ({canvasElement}) => {
		// Assigns canvas to the component root element
		const canvas = within(canvasElement);
		const user = userEvent.setup();

		await user.click(canvas.getByText('View'));
	},
};
