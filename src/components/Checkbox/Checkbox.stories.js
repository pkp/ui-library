import Checkbox from './Checkbox.vue';

export default {
	title: 'Components/Checkbox',
	component: Checkbox,
	render: (args) => ({
		components: {Checkbox},
		setup() {
			return {args};
		},
		template: '<Checkbox v-bind="args" />',
	}),
};

export const Default = {
	args: {
		labelledBy: 'checkbox_example',
		checked: true,
	},
	render: (args) => ({
		components: {Checkbox},
		setup() {
			return {args};
		},
		template: `<span id="checkbox_example" class="sr-only">Checkbox with label</span>
                    <Checkbox v-bind="args" />
                `,
	}),
};

export const Disabled = {
	args: {
		labelledBy: 'checkbox_disabled',
		checked: true,
		disabled: true,
	},
	render: (args) => ({
		components: {Checkbox},
		setup() {
			return {args};
		},
		template: `<span id="checkbox_disabled" class="sr-only">Disabled checkbox</span>
                    <Checkbox v-bind="args" />
                `,
	}),
};

export const WithLabel = {
	args: {
		label: 'Checkbox with label',
		checked: false,
	},
};
