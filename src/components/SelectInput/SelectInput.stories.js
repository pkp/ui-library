import {ref} from 'vue';
import SelectInput from './SelectInput.vue';

export default {
	title: 'Components/SelectInput',
	component: SelectInput,
	render: (args) => ({
		components: {SelectInput},
		setup() {
			const value = ref(args.modelValue);
			return {args, value};
		},
		template: `
			<SelectInput v-bind="args" v-model="value" />
		`,
	}),
};

const pageSizeOptions = [
	{value: 10, label: '10'},
	{value: 25, label: '25'},
	{value: 50, label: '50'},
	{value: 100, label: '100'},
];

export const Default = {
	args: {
		modelValue: 25,
		options: pageSizeOptions,
		ariaLabel: 'Items per page',
	},
};

export const WithPlaceholder = {
	args: {
		modelValue: '',
		options: pageSizeOptions,
		placeholder: 'Choose a page size',
		ariaLabel: 'Items per page',
	},
};

export const Disabled = {
	args: {
		modelValue: 25,
		options: pageSizeOptions,
		ariaLabel: 'Items per page',
		disabled: true,
	},
};

export const Large = {
	args: {
		modelValue: 25,
		options: pageSizeOptions,
		ariaLabel: 'Items per page',
		size: 'large',
	},
};

export const BorderlessVariant = {
	args: {
		modelValue: 25,
		options: pageSizeOptions,
		ariaLabel: 'Items per page',
		variant: 'borderless',
	},
};
