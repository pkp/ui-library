import FieldSlider from './FieldSlider.vue';

import FieldBaseMock from '../mocks/field-base';
import FieldSliderMock from '../mocks/field-slider';

export default {
	title: 'Forms/FieldSlider',
	component: FieldSlider,
	render: (args) => ({
		components: {FieldSlider},
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
			<FieldSlider v-bind="args" @change="change" />
		`,
	}),
};

export const Base = {
	args: {
		...FieldBaseMock,
		...FieldSliderMock,
		//		description: 'slider description',
	},
};
