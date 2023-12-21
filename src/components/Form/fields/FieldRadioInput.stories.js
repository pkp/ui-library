import FieldRadioInput from './FieldRadioInput.vue';
import FieldBaseMock from '../mocks/field-base';
import FieldRadioInputMock from '../mocks/field-radio-input';

export default {
	title: 'Forms/FieldRadioInput',
	component: FieldRadioInput,
	render: (args) => ({
		components: {FieldRadioInput},
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
			<FieldRadioInput v-bind="args" @change="change" />
		`,
	}),
};

export const Base = {
	args: {...FieldBaseMock, ...FieldRadioInputMock},
};
