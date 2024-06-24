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
		direction: 'left',
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
		direction: 'right',
	},
	play: async ({canvasElement}) => {
		// Assigns canvas to the component root element
		const canvas = within(canvasElement);
		const user = userEvent.setup();

		await user.click(canvas.getByText('Right Aligned Menu'));
	},
};
