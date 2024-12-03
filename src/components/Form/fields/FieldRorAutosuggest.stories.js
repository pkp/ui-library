import FieldRorAutosuggest from './FieldRorAutosuggest.vue';

export default {
	title: 'Components/FieldRorAutosuggest',
	component: FieldRorAutosuggest,
	render: (args) => ({
		components: {FieldRorAutosuggest},
		setup() {
			return {args};
		},
		template: '<FieldRorAutosuggest v-bind="args" />',
	}),
};

export const Default = {
	render: (args) => ({
		components: {FieldRorAutosuggest},
		setup() {
			return {args};
		},
		template: '<FieldRorAutosuggest v-bind="args" />',
	}),
	args: {},
};
