import PkpDropdownMenu from './PkpDropdownMenu.vue';
import '../../../styles/_frontend-theme.less';

export default {
	title: 'Frontend/PkpDropdownMenu',
	component: PkpDropdownMenu,
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
