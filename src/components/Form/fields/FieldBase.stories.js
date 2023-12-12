import FieldBase from './FieldBase.vue';
import FieldText from '@/components/Form/fields/FieldText.vue';

import FieldBaseMock from '../mocks/field-base';
import FieldTextEmailMock from '../mocks/field-text-email';

export default {
	title: 'Forms/FieldBase',
	component: FieldBase,
	render: (args) => ({
		components: {FieldText},
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
			<FieldText v-bind="args" @change="change" />
		`,
	}),
};

export const Base = {
	args: {...FieldBaseMock, ...FieldTextEmailMock, isRequired: false},
};

export const WithDescription = {
	args: {
		...FieldBaseMock,
		label: 'Journal Initials',
		description:
			'Enter two to four letters that uniquely identify your journal.',
		value: '',
	},
};

export const WithError = {
	args: {
		...FieldBaseMock,
		name: 'initials',
		allErrors: {
			initials: ['The journal initials can not contain any spaces.'],
		},
		label: 'Journal Initials',
		value: 'JP K',
	},
};

export const WithTooltip = {
	args: {
		...FieldBaseMock,
		label: 'Journal Initials',
		tooltip: 'Enter two to four letters that uniquely identify your journal.',
		value: '',
	},
};
