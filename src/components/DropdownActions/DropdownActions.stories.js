import DropdownActions from './DropdownActions.vue';
import {within, userEvent} from '@storybook/test';

export default {
	title: 'Components/DropdownActions',
	component: DropdownActions,
	render: (args) => ({
		components: {DropdownActions},
		setup() {
			return {args};
		},
		template: '<DropdownActions v-bind="args" />',
	}),
	argTypes: {
		direction: {
			control: {type: 'select'},
			options: ['left', 'right'],
		},
	},
	decorators: [
		() => ({
			template:
				'<div style="height: 300px; padding: 10px;" class="text-center"><story/></div>',
		}),
	],
};

const downloadActions = [
	{
		label: 'Author-Only Sections Displayed (PDF)',
		name: 'authorPdf',
	},
	{
		label: 'Author-Only Sections Displayed (XML)',
		name: 'authorXml',
	},
	{
		label: 'Editor Forms Shows All Review Sections (PDF)',
		name: 'editorPdf',
	},
	{
		label: 'Editor Forms Shows All Review Sections (XML)',
		name: 'editorXml',
	},
];

export const Default = {
	render: (args) => ({
		components: {DropdownActions},
		setup() {
			function authorPdf() {
				console.log('authorPdf clicked');
			}

			function authorXml() {
				console.log('authorXml clicked');
			}

			function editorPdf() {
				console.log('editorPdf clicked');
			}

			function editorXml() {
				console.log('editorXml clicked');
			}

			function handleAction(name) {
				switch (name) {
					case 'authorPdf':
						authorPdf();
						break;
					case 'authorXml':
						authorXml();
						break;
					case 'editorPdf':
						editorPdf();
						break;
					case 'editorXml':
						editorXml();
						break;
					default:
						console.error(`No handler for action: ${name}`);
				}
			}
			return {args, handleAction};
		},
		template: '<DropdownActions v-bind="args" @action="handleAction" />',
	}),
	args: {
		actions: downloadActions,
		label: 'Download Review Form',
		ariaLabel: 'Click to download content in the available formats',
		direction: 'left',
	},
	play: async ({canvasElement}) => {
		// Assigns canvas to the component root element
		const canvas = within(canvasElement);
		const user = userEvent.setup();

		await user.click(canvas.getByText('Download Review Form'));
	},
};

export const RightAlignedMenu = {
	...Default,
	args: {
		actions: downloadActions,
		label: 'Right Aligned Menu',
		direction: 'right',
	},
	play: async ({canvasElement}) => {
		// Assigns canvas to the component root element
		const canvas = within(canvasElement);
		const user = userEvent.setup();

		await user.click(canvas.getByText('Right Aligned Menu'));
	},
};

export const EllipsisMenu = {
	args: {
		actions: [
			{
				label: 'View',
				url: '#',
				icon: 'View',
			},
			{
				label: 'Email',
				url: '#',
				icon: 'Email',
			},
			{
				label: 'Login As',
				url: '#',
				icon: 'LoginAs',
			},
			{
				label: 'Remove User',
				url: '#',
				icon: 'Cancel',
				isWarnable: true,
			},
			{
				label: 'Disable User',
				url: '#',
				icon: 'DisableUser',
				isWarnable: true,
			},
			{
				label: 'Merge User',
				url: '#',
				icon: 'MergeUser',
			},
		],
		label: 'User management options',
		buttonVariant: 'ellipsis',
		direction: 'left',
	},
	play: async ({canvasElement}) => {
		// Assigns canvas to the component root element
		const canvas = within(canvasElement);
		const user = userEvent.setup();

		await user.click(canvas.getByLabelText('User management options'));
	},
};

export const TextButton = {
	args: {
		actions: [
			{
				label: 'Version 1: 2024-8-13',
				url: '#',
			},
			{
				label: 'Version 2: Unpublished',
				url: '#',
			},
		],
		label: 'All Versions',
		buttonVariant: 'text',
		direction: 'right',
	},
	play: async ({canvasElement}) => {
		// Assigns canvas to the component root element
		const canvas = within(canvasElement);
		const user = userEvent.setup();

		await user.click(canvas.getByText('All Versions'));
	},
};
