import FieldContrastColorPicker from './FieldContrastColorPicker.vue';
import FieldBaseMock from '../mocks/field-base';
import FieldContrastColorPickerMock from '../mocks/field-contrast-color-picker';

export default {
	title: 'Forms/FieldContrastColorPicker',
	component: FieldContrastColorPicker,
	render: (args) => ({
		components: {FieldContrastColorPicker},
		setup() {
			function change(name, prop, newValue, localeKey) {
				if (localeKey) {
					args[prop][localeKey] = newValue;
				} else {
					args[prop] = newValue;
				}
				console.log('Value changed:', newValue);
			}

			function updateContrastColor(color) {
				console.log('Contrast color selected:', color);
			}

			return {args, change, updateContrastColor};
		},
		template: `
			<FieldContrastColorPicker
				v-bind="args"
				@change="change"
				@update:contrastColor="updateContrastColor"
			/>
		`,
	}),
};

export const Base = {
	args: {...FieldBaseMock, ...FieldContrastColorPickerMock},
};

export const Required = {
	args: {
		...Base.args,
		isRequired: true,
	},
};

export const WithTooltip = {
	args: {
		...Base.args,
		tooltip:
			'Select colors with a contrast ratio of at least 4.5:1 for normal text to ensure readability.',
	},
};
