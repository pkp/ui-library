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
		actions: {
			description:
				'An array of action objects. Each object should contain `label` (string), `url` (string), an optional `icon` (string) and `isWarnable` (boolean) if the button needs the "warning" button styling from `<Button>` component.',
			table: {
				type: {summary: 'Array'},
				defaultValue: {summary: '[]'},
			},
			defaultValue: [],
		},
		name: {
			control: {type: 'text'},
			description:
				'The name of the dropdown menu component (optional). If not supplied, then the dropdown menu will use an ellipsis menu (`...`)',
		},
		position: {
			control: {type: 'select'},
			options: ['left', 'right'],
			description:
				'Determines where to show the dropdown button. Options include `left` and `right`.',
		},
	},
};

const downloadActions = [
	{
		label: 'Author-Only Sections Displayed (PDF)',
		url: '#',
	},
	{
		label: 'Author-Only Sections Displayed (XML)',
		url: '#',
	},
	{
		label: 'Editor Forms Shows All Review Sections (PDF)',
		url: '#',
	},
	{
		label: 'Editor Forms Shows All Review Sections (XML)',
		url: '#',
	},
];

export const Default = {
	args: {
		actions: downloadActions,
		name: 'Download Review Form',
	},
	decorators: [
		() => ({
			template: '<div style="height: 250px"><story/></div>',
		}),
	],
	play: async ({canvasElement}) => {
		// Assigns canvas to the component root element
		const canvas = within(canvasElement);
		const user = userEvent.setup();

		await user.click(canvas.getByRole('button'));
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
		name: undefined,
	},
	decorators: [
		() => ({
			template: '<div style="height: 300px"><story/></div>',
		}),
	],
	play: async ({canvasElement}) => {
		// Assigns canvas to the component root element
		const canvas = within(canvasElement);
		const user = userEvent.setup();

		await user.click(canvas.getByRole('button'));
	},
};

export const LeftPosition = {
	args: {
		actions: downloadActions,
		name: 'Left Dropdown',
		position: 'left',
	},
	decorators: [
		() => ({
			template: '<div style="height: 250px"><story/></div>',
		}),
	],
	play: async ({canvasElement}) => {
		// Assigns canvas to the component root element
		const canvas = within(canvasElement);
		const user = userEvent.setup();

		await user.click(canvas.getByRole('button'));
	},
};
