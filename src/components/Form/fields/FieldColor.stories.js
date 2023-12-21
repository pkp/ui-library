import FieldColor from './FieldColor.vue';
import FieldBaseMock from '../mocks/field-base';
import FieldColorMock from '../mocks/field-color';

export default {
	title: 'Forms/FieldColor',
	component: FieldColor,
	render: (args) => ({
		components: {FieldColor},
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
			<FieldColor v-bind="args" @change="change" />
		`,
	}),
};

export const Base = {
	args: {...FieldBaseMock, ...FieldColorMock},
};
