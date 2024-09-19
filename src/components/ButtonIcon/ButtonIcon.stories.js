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
	render: (args) => ({
		components: {ButtonIcon},
		setup() {
			return {args};
		},
		template: `
			<div class="flex gap-x-1">
				<ButtonIcon icon="ChevronUp" />
				<ButtonIcon icon="ChevronDown" />
			</div>
			`,
	}),

	args: {},
};

export const IconOnly = {
	args: {
		icon: 'Dropdown',
		iconOnly: true,
	},
};
