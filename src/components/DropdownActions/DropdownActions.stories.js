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
			table: {
				type: {summary: 'text'},
				defaultValue: {summary: ''},
			},
			description:
				"The text label for the button. This is optional. If `isEllipsis` is `false` and `name` is provided, it will be used as the button's label.",
		},
		position: {
			control: {type: 'select'},
			options: ['left', 'right'],
			description:
				'Determines where to show the dropdown button. Options include `left` and `right`.',
		},
		isEllipsis: {
			control: {type: 'boolean'},
			table: {
				type: {summary: 'boolean'},
				defaultValue: {summary: false},
			},
			description:
				'If `true`, the button will display an ellipsis (`...`), and the `ariaLabel` prop must be provided for accessibility.',
		},
		ariaLabel: {
			control: {type: 'text'},
			table: {
				type: {summary: 'text'},
				defaultValue: {summary: ''},
			},
			description:
				'The accessible label for the button, used by screen readers. Required if `isEllipsis` is `true`. If not provided, the component will use the `name` prop or default to "More actions".',
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
		isEllipsis: true,
		ariaLabel: 'User management options',
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

		await user.click(canvas.getByText('User management options'));
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

		await user.click(canvas.getByText('Left Dropdown'));
	},
};
