import WorkflowLogResponseModal from './WorkflowLogResponseModal.vue';
import PkpButton from '@/components/Button/Button.vue';
import {useModal} from '@/composables/useModal';
import {within, userEvent} from '@storybook/test';

export default {
	title: 'Pages/Workflow/LogResponse',
	component: WorkflowLogResponseModal,
};

export const Base = {
	render: (args) => ({
		components: {WorkflowLogResponseModal, PkpButton},
		setup() {
			const {openSideModal} = useModal();

			function logResponse() {
				openSideModal(WorkflowLogResponseModal, args.modalProps);
			}
			return {logResponse, ...args};
		},
		template: '<PkpButton @click="logResponse">Log Response</PkpButton>',
	}),
	args: {
		modalProps: {
			description:
				'Sodium butyrate improves growth performance of weaned piglets during the first period after weaning',
			submissionId: 12,
			logResponseForm: {
				id: 'logResponseForm',
				method: 'POST',
				action:
					'http://localhost:7003/index.php/publicknowledge/$$$call$$$/grid/users/reviewer/reviewer-grid/add-log?submissionId=12&reviewAssignmentId=17&stageId=3&round=0',
				fields: [
					{
						name: 'acceptReview',
						isRequired: true,
						description:
							'If the reviewer contacts you through email or any other means, you can record their response for them',
						component: 'field-options',
						label: 'Record the response on behalf of the reviewer',
						value: false,
						type: 'radio',
						options: [
							{
								value: 1,
								label: 'Reviewer has accepted the invitation to review',
							},
							{
								value: 0,
								label: 'Reviewer has declined the invitation to review',
							},
						],
						groupId: 'default',
					},
				],
				groups: [{id: 'default', pageId: 'default'}],
				pages: [{id: 'default', submitButton: {label: 'Log Response'}}],
				primaryLocale: 'en',
				visibleLocales: ['en'],
				supportedFormLocales: ['en', 'fr_CA'],
			},
		},
	},
	play: async ({canvasElement}) => {
		// Assigns canvas to the component root element
		const canvas = within(canvasElement);
		const user = userEvent.setup();

		await user.click(canvas.getByText('Log Response'));
	},
	decorators: [
		() => ({
			template: '<div style="height: 900px"><story/></div>',
		}),
	],
};
