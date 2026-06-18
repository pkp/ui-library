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
	parameters: {
		docs: {
			description: {
				component:
					'A color picker component that helps users select color combinations with sufficient contrast for accessibility compliance. Includes accessibility features like keyboard navigation and WCAG contrast validation.',
			},
		},
	},
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

export const WithDescription = {
	args: {
		...Base.args,
		description:
			'This color picker helps ensure your text is readable by checking contrast against WCAG standards. For more information, click the link below the contrast categories.',
	},
};

export const WithHighContrast = {
	args: {
		...Base.args,
		value: JSON.stringify({
			color1: '#000000',
			color2: '#ffffff',
		}),
	},
	parameters: {
		docs: {
			description: {
				story:
					'Example with maximum contrast (black and white), which passes all WCAG accessibility levels.',
			},
		},
	},
};

export const WithLowContrast = {
	args: {
		...Base.args,
		value: JSON.stringify({
			color1: '#777777',
			color2: '#999999',
		}),
	},
	parameters: {
		docs: {
			description: {
				story:
					'Example with insufficient contrast that fails to meet WCAG accessibility levels, showing the visual indicators for failed tests.',
			},
		},
	},
};
