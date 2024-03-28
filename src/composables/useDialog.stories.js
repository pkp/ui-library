import {within, userEvent} from '@storybook/test';

import {useDialog} from './useDialog';
import PkpButton from '@/components/Button/Button.vue';

export default {
	title: 'composables/useDialog',
	render: (args) => ({
		components: {PkpButton},
		setup() {
			const {openDialog} = useDialog();

			return {openDialog, args};
		},
		template: `
			<PkpButton @click="openDialog(args)">{{args.buttonName}}</PkpButton> 
		`,
	}),
};

export const BasicExample = {
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
	},
	play: async ({canvasElement}) => {
		// Assigns canvas to the component root element
		const canvas = within(canvasElement);
		const user = userEvent.setup();

		await user.click(canvas.getByText('Basic Example'));
	},
	decorators: [
		() => ({
			template: '<div style="height: 400px"><story/></div>',
		}),
	],
};

export const FullExample = {
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
	decorators: [
		() => ({
			template: '<div style="height: 400px"><story/></div>',
		}),
	],
};
