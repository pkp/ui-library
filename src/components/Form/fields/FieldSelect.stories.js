import FieldSelect from './FieldSelect.vue';
import FieldBaseMock from '../mocks/field-base';
import FieldSelectCountryMock from '../mocks/field-select-country';

export default {
	title: 'Forms/FieldSelect',
	component: FieldSelect,
	render: (args) => ({
		components: {FieldSelect},
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
			<FieldSelect v-bind="args" @change="change" />
		`,
	}),
};

export const Base = {
	args: {...FieldBaseMock, ...FieldSelectCountryMock},
};
