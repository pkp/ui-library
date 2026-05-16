import FieldMultiSelect from './FieldMultiSelect.vue';
import FieldBaseMock from '../mocks/field-base';
import FieldMultiSelectMock from '../mocks/field-multi-select';

export default {
	title: 'Forms/FieldMultiSelect',
	component: FieldMultiSelect,
	render: (args) => ({
		components: {FieldMultiSelect},
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
			<FieldMultiSelect v-bind="args" @change="change" />
		`,
	}),
};

export const Base = {
	args: {...FieldBaseMock, ...FieldMultiSelectMock},
};

export const Preselected = {
	args: {...FieldBaseMock, ...FieldMultiSelectMock, value: [2]},
};

export const Disabled = {
	args: {...FieldBaseMock, ...FieldMultiSelectMock, value: [2], disabled: true},
};
