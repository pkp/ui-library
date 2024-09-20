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

export const EnlargedIcon = {
	render: (args) => ({
		components: {ButtonIcon},
		setup() {
			return {args};
		},
		template: `
			<div class="inline-flex gap-1">
				<ButtonIcon icon="ChevronUp" :enlarged="true"/>
				<ButtonIcon icon="ChevronDown" :enlarged="true" />
			</div>
			`,
	}),
	args: {},
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
