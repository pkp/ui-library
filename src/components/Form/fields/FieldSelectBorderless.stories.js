import {ref} from 'vue';
import FieldSelectBorderless from './FieldSelectBorderless.vue';

export default {
	title: 'Forms/FieldSelectBorderless',
	component: FieldSelectBorderless,
	render: (args) => ({
		components: {FieldSelectBorderless},
		setup() {
			const value = ref(args.modelValue);
			return {args, value};
		},
		template: `
			<FieldSelectBorderless v-bind="args" v-model="value" />
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

export const WithLabel = {
	args: {
		modelValue: 25,
		options: pageSizeOptions,
		label: 'Show',
	},
};

export const Disabled = {
	args: {
		modelValue: 25,
		options: pageSizeOptions,
		label: 'Show',
		disabled: true,
	},
};
