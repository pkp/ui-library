import '@/styles/frontend-theme.css';
import PkpDropdownMenu from '../PkpDropdownMenu.vue';

export default {
	title: 'Frontend/PkpDropdownMenu',
	component: PkpDropdownMenu,
	argTypes: {
		align: {
			control: 'select',
			options: ['start', 'center', 'end'],
			description: 'Alignment of menu content relative to the trigger',
		},
	},
	render: (args) => ({
		components: {PkpDropdownMenu},
		setup() {
			return {args};
		},
		template: '<PkpDropdownMenu v-bind="args" />',
	}),
};

export const Primary = {
	args: {
		items: [
			{name: 'edit', label: 'Edit'},
			{name: 'duplicate', label: 'Duplicate'},
			{name: 'delete', label: 'Delete'},
		],
		triggerAriaLabel: 'More options',
	},
};

export const WithLabel = {
	name: 'With Text Label',
	args: {
		items: [
			{name: 'pdf', label: 'Download PDF'},
			{name: 'xml', label: 'Download XML'},
			{name: 'html', label: 'View HTML'},
		],
		triggerLabel: 'Download',
	},
};

export const WithIconAndLabel = {
	name: 'With Icon and Label',
	args: {
		items: [
			{name: 'view', label: 'View Details'},
			{name: 'edit', label: 'Edit'},
			{name: 'share', label: 'Share'},
		],
		triggerIcon: 'User',
		triggerLabel: 'Actions',
	},
};

export const WithDisabledItem = {
	name: 'With Disabled Item',
	args: {
		items: [
			{name: 'view', label: 'View'},
			{name: 'edit', label: 'Edit', disabled: true},
			{name: 'delete', label: 'Delete'},
		],
		triggerAriaLabel: 'Actions menu',
	},
};

export const WithLinks = {
	name: 'With Link Items',
	args: {
		items: [
			{name: 'docs', label: 'Documentation', href: 'https://docs.pkp.sfu.ca'},
			{
				name: 'github',
				label: 'GitHub (new tab)',
				href: 'https://github.com/pkp',
				target: '_blank',
			},
			{
				name: 'forum',
				label: 'Community Forum',
				href: 'https://forum.pkp.sfu.ca',
			},
		],
		triggerLabel: 'Resources',
	},
};

export const MixedActionsAndLinks = {
	name: 'Mixed Actions and Links',
	args: {
		items: [
			{name: 'edit', label: 'Edit', actionFn: () => alert('Edit clicked')},
			{name: 'preview', label: 'Preview', href: '/preview'},
			{
				name: 'external',
				label: 'View on Website',
				href: 'https://example.com',
				target: '_blank',
			},
			{
				name: 'delete',
				label: 'Delete',
				actionFn: () => alert('Delete clicked'),
			},
		],
		triggerAriaLabel: 'Item actions',
	},
};

export const WithItemIcons = {
	name: 'With Item Icons',
	args: {
		items: [
			{name: 'profile', label: 'Profile', icon: 'User'},
			{name: 'help', label: 'Help', icon: 'Help'},
			{name: 'delete', label: 'Delete', icon: 'Cancel'},
		],
		triggerAriaLabel: 'Actions with icons',
	},
};

export const AlignmentDemo = {
	name: 'Alignment Options',
	render: (args) => ({
		components: {PkpDropdownMenu},
		setup() {
			const items = [
				{name: 'option1', label: 'Option 1'},
				{name: 'option2', label: 'Option 2'},
				{name: 'option3', label: 'Option 3'},
			];
			return {items, args};
		},
		template: `
			<div style="display: flex; justify-content: space-around; padding: 20px;">
				<div style="text-align: center;">
					<p style="margin-bottom: 8px; font-size: 14px;">align="start"</p>
					<PkpDropdownMenu :items="items" align="start" trigger-label="Start" />
				</div>
				<div style="text-align: center;">
					<p style="margin-bottom: 8px; font-size: 14px;">align="center"</p>
					<PkpDropdownMenu :items="items" align="center" trigger-label="Center" />
				</div>
				<div style="text-align: center;">
					<p style="margin-bottom: 8px; font-size: 14px;">align="end"</p>
					<PkpDropdownMenu :items="items" align="end" trigger-label="End" />
				</div>
			</div>
		`,
	}),
};
