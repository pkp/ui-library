import PkpDialog from './Dialog.vue';
import {useModal} from '@/composables/useModal.js';
import {within, userEvent} from '@storybook/test';
import PkpButton from '@/components/Button/Button.vue';

export default {
	title: 'Components/Dialog',
	component: PkpDialog,
	render: (args) => ({
		components: {PkpButton},
		setup() {
			const {openDialog} = useModal();

			return {openDialog, args};
		},
		template: `
			<PkpButton @click="openDialog(args)">{{args.buttonName}}</PkpButton> 
		`,
	}),
	decorators: [
		() => ({
			template: '<div style="height: 400px"><story/></div>',
		}),
	],
};

export const DialogBasic = {
	args: {
		buttonName: 'Basic Example',
		name: 'basic',
		title: 'Submit Article',
		message: 'Are you sure you want to submit this article?',
		actions: [
			{
				label: 'Confirm',
				isPrimary: true,
				callback: (close) => {
					// Simulate a server request
					setTimeout(() => close(), 2000);
				},
			},
			{
				label: 'Cancel',
				isWarnable: true,
				callback: (close) => close(),
			},
		],
		modalStyle: 'basic',
	},
	play: async ({canvasElement}) => {
		// Assigns canvas to the component root element
		const canvas = within(canvasElement);
		const user = userEvent.setup();

		await user.click(canvas.getByText('Basic Example'));
	},
};

const DialogBodyComponent = {
	template: `
    	<p>{{ 'Some DOI(s) could not be updated' }}</p>
        <ul>
            <li v-for="errorMessage in failedDoiActions" :key="errorMessage.index">
                {{ errorMessage }}
            </li>
        </ul>
    `,
	props: {
		failedDoiActions: {type: Array, required: true},
	},
};

export const WithBodyComponent = {
	args: {
		buttonName: 'With Body Component',
		title: 'Submit Article',
		bodyComponent: DialogBodyComponent,
		bodyProps: {
			failedDoiActions: ['First error to display', 'Second error to display'],
		},
		actions: [
			{
				label: 'Ok',
				isPrimary: true,
				callback: (close) => {
					// user has confirmed
					close();
				},
			},
		],
		close: () => {
			// dialog has been closed
		},
	},
	play: async ({canvasElement}) => {
		// Assigns canvas to the component root element
		const canvas = within(canvasElement);
		const user = userEvent.setup();

		await user.click(canvas.getByText('With Body Component'));
	},
};

export const NonDismissible = {
	args: {
		buttonName: 'Show non-dismissible modal',
		name: 'non-dismissible-modal',
		title: 'Non-Dismissible Modal',
		message:
			'Clicking outside will not close this modal. Use the "Cancel" button to close it.',
		actions: [
			{
				label: 'Cancel',
				isWarnable: true,
				callback: (close) => close(),
			},
		],
		isDismissible: false,
		close: () => console.log('closed example dialog'), // eslint-disable-line,
	},
	play: async ({canvasElement}) => {
		// Assigns canvas to the component root element
		const canvas = within(canvasElement);
		const user = userEvent.setup();

		await user.click(canvas.getByText('Show non-dismissible modal'));
	},
};

export const NoActionButtons = {
	args: {
		buttonName: 'Show modal',
		name: 'no-actions-modal',
		title: 'Non Action Buttons Modal',
		message:
			'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
		actions: [],
		close: () => console.log('closed example dialog'), // eslint-disable-line,
	},
	play: async ({canvasElement}) => {
		// Assigns canvas to the component root element
		const canvas = within(canvasElement);
		const user = userEvent.setup();

		await user.click(canvas.getByText('Show modal'));
	},
};

export const DialogComplex = {
	args: {
		buttonName: 'Full Example',

		name: 'full',
		title: 'Several Actions',
		message:
			'This dialog includes an action that is a link (Visit Page). It also logs something to the console when the modal is closed. Dialogs should have 2 or 3 actions at the most.',
		actions: [
			{
				label: 'Confirm',
				isPrimary: true,
				callback: (close) => {
					// Simulate a server request
					setTimeout(() => close(), 2000);
				},
			},
			{
				label: 'Visit Page',
				element: 'a',
				href: 'https://example.org',
			},
			{
				label: 'Cancel',
				isWarnable: true,
				callback: (close) => close(),
			},
		],
		close: () => console.log('closed full example dialog'), // eslint-disable-line
	},
	play: async ({canvasElement}) => {
		// Assigns canvas to the component root element
		const canvas = within(canvasElement);
		const user = userEvent.setup();

		await user.click(canvas.getByText('Full Example'));
	},
};

const ErrorBodyComponent = {
	template: `
    	<span>Cancelling the invitation sent to Emma Stone will deactivate the acceptance link sent to her via email. Here are the invitation details:</span>
        <ul class="list-disc ms-7">
            <li>
                <strong>Email Address:</strong> {email address}
            </li>
            <li>
                <strong>Role:</strong> Reviewer
            </li>
            <li>
                <strong>Status</strong> Invited on 17.05.2023
            </li>
            <li>
                <strong>Affiliate:</strong> Stanford University
            </li>
        </ul>
    `,
	props: {
		failedDoiActions: {type: Array, required: true},
	},
};

export const NegativeState = {
	args: {
		buttonName: 'Show modal',
		name: 'error',
		title: 'Cancel Invitation',
		bodyComponent: ErrorBodyComponent,
		actions: [
			{
				label: 'Cancel Invitation',
				isWarnable: true,
				callback: (close) => {
					// Simulate a server request
					setTimeout(() => close(), 2000);
				},
			},
			{
				label: 'Cancel',
				callback: (close) => close(),
			},
		],
		close: () => console.log('closed example dialog'), // eslint-disable-line,
		modalStyle: 'negative',
	},
	play: async ({canvasElement}) => {
		// Assigns canvas to the component root element
		const canvas = within(canvasElement);
		const user = userEvent.setup();

		await user.click(canvas.getByText('Show modal'));
	},
};

export const SuccessState = {
	args: {
		buttonName: 'Show modal',
		name: 'error',
		title: "You've been added as a section editor in OJS",
		message:
			'Congratulations! As a section editor you might get access to more options in OJS. If you need any assistance in understanding the system, please click on "Help" buttons throughout the system to guide you through the interface.',
		actions: [
			{
				label: 'View All Submissions',
				callback: (close) => close(),
			},
		],
		close: () => console.log('closed example dialog'), // eslint-disable-line,
		modalStyle: 'success',
	},
	play: async ({canvasElement}) => {
		// Assigns canvas to the component root element
		const canvas = within(canvasElement);
		const user = userEvent.setup();

		await user.click(canvas.getByText('Show modal'));
	},
};

export const PrimaryStyle = {
	args: {
		buttonName: 'Show modal',
		name: 'primary',
		title: 'Primary Color',
		message: "This dialog uses the application's primary color.",
		actions: [
			{
				label: 'Ok',
				callback: (close) => close(),
			},
		],
		close: () => console.log('closed example dialog'), // eslint-disable-line,
		modalStyle: 'primary',
	},
	play: async ({canvasElement}) => {
		// Assigns canvas to the component root element
		const canvas = within(canvasElement);
		const user = userEvent.setup();

		await user.click(canvas.getByText('Show modal'));
	},
};
