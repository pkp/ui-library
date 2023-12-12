import FieldAutosuggestPreset from './FieldAutosuggestPreset.vue';
import FieldBaseMock from '../mocks/field-base';
import FieldBaseAutosuggest from '../mocks/field-autosuggest';

export default {
	title: 'Forms/FieldAutosuggestPreset',
	component: FieldAutosuggestPreset,
	render: (args) => ({
		components: {FieldAutosuggestPreset},
		setup() {
			function change(name, prop, newValue, localeKey) {
				if (localeKey) {
					args[prop][localeKey] = newValue;
				} else {
					args[prop] = newValue;
				}
			}

			return {args, change};
		},
		template: `
			<FieldAutosuggestPreset v-bind="args" @change="change" />
		`,
	}),
};

export const Base = {
	args: {
		...FieldBaseMock,
		...FieldBaseAutosuggest,
		label: 'Sections',
		options: [
			{
				value: 1,
				label: 'Articles',
			},
			{
				value: 2,
				label: 'Editorials',
			},
			{
				value: 3,
				label: 'Reviews',
			},
			{
				value: 4,
				label: 'Field Notes',
			},
			{
				value: 5,
				label: 'Roundtables',
			},
			{
				value: 6,
				label: 'Research Reviews',
			},
			{
				value: 7,
				label: 'Conference Proceedings',
			},
		],
		value: [1],
		selected: [
			{
				value: 1,
				label: 'Articles',
			},
		],
	},
	parameters: {
		docs: {
			story: {
				height: '300px',
			},
		},
	},
};
