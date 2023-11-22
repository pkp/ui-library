import Button from './Button.vue';

export default {
	component: Button,
};

export const Primary = {
	render: (args) => ({
		components: {Button},
		setup() {
			return {args};
		},
		template: '<Button v-bind="args">Primary</Button>',
	}),
	args: {
		isPrimary: true,
	},
};

export const Warnable = {
	render: (args) => ({
		components: {Button},
		setup() {
			return {args};
		},
		template: '<Button v-bind="args">Warning</Button>',
	}),
	args: {
		isWarnable: true,
	},
};
