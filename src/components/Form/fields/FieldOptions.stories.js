import FieldOptions from './FieldOptions.vue';
import FieldBaseMock from '../mocks/field-base';
import FieldOptionsUserLocales from '../mocks/field-options-user-locales';
import FieldOptionsEmails from '../mocks/field-options-emails';
import FieldOptionsConfirmation from '../mocks/field-options-confirmation';
import FieldOptionsOrderable from '../mocks/field-options-orderable';
import FieldOptionsOnlySorting from '../mocks/field-options-onlySorting';

export default {
	title: 'Forms/FieldOptions',
	component: FieldOptions,
	render: (args) => ({
		components: {FieldOptions},
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
			<FieldOptions v-bind="args" @change="change" />
		`,
	}),
};

export const Base = {
	args: {...FieldBaseMock, ...FieldOptionsUserLocales},
};

export const Radio = {
	args: {...FieldBaseMock, ...FieldOptionsEmails},
};

export const Confirm = {
	args: {...FieldBaseMock, ...FieldOptionsConfirmation},
};

export const Orderable = {
	args: {...FieldBaseMock, ...FieldOptionsOrderable},
};

export const OnlySorting = {
	args: {...FieldBaseMock, ...FieldOptionsOnlySorting},
};
