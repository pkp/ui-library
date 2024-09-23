import ButtonIcon from './ButtonIcon.vue';
export default {
	title: 'Components/ButtonIcon',
	component: ButtonIcon,
	render: (args) => ({
		components: {ButtonIcon},
		setup() {
			return {args};
		},
		template: '<ButtonIcon v-bind="args" />',
	}),
};

export const Default = {
	args: {
		icon: 'Add',
		ariaLabel: 'Add more items',
	},
};

export const Disabled = {
	args: {
		icon: 'Cancel',
		ariaLabel: 'Cancel',
		isDisabled: true,
	},
};

export const Active = {
	args: {
		icon: 'Complete',
		ariaLabel: 'Complete',
		isActive: true,
	},
};
