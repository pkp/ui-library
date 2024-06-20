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
		action: 'authorPdf',
	},
	{
		label: 'Author-Only Sections Displayed (XML)',
		action: 'authorXml',
	},
	{
		label: 'Editor Forms Shows All Review Sections (PDF)',
		action: 'editorPdf',
	},
	{
		label: 'Editor Forms Shows All Review Sections (XML)',
		action: 'editorXml',
	},
];

export const Default = {
	args: {
		actions: downloadActions,
		label: 'Download Review Form',
	},
	play: async ({canvasElement}) => {
		// Assigns canvas to the component root element
		const canvas = within(canvasElement);
		const user = userEvent.setup();

		await user.click(canvas.getByText('Download Review Form'));
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
		displayAsEllipsis: true,
	},
	play: async ({canvasElement}) => {
		// Assigns canvas to the component root element
		const canvas = within(canvasElement);
		const user = userEvent.setup();

		await user.click(canvas.getByText('User management options'));
	},
};

export const RightAlignedMenu = {
	args: {
		actions: downloadActions,
		label: 'Right Aligned Menu',
		ariaLabel: 'Click to download content by available formats',
		direction: 'right',
	},
	play: async ({canvasElement}) => {
		// Assigns canvas to the component root element
		const canvas = within(canvasElement);
		const user = userEvent.setup();

		await user.click(canvas.getByText('Right Aligned Menu'));
	},
};
