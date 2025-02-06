import FieldText from './FieldText.vue';

import FieldBaseMock from '../mocks/field-base';
import FieldTextGivenNameMock from '../mocks/field-text-given-name';
import FieldTextDoiPrefixMock from '../mocks/field-text-doi-prefix';

export default {
	title: 'Forms/FieldText',
	component: FieldText,
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
	args: {
		...FieldBaseMock,
		...FieldTextGivenNameMock,
		isRequired: false,
	},
};

export const Small = {
	args: {
		...FieldBaseMock,
		...FieldTextDoiPrefixMock,
	},
};

export const Large = {
	args: {
		...FieldBaseMock,
		...FieldTextDoiPrefixMock,
		size: 'large',
		label: 'Title',
	},
};

export const Disabled = {
	args: {
		...FieldBaseMock,
		...FieldTextGivenNameMock,
		isRequired: false,
		disabled: true,
	},
};

export const WithPrefix = {
	args: {
		...FieldBaseMock,
		...FieldTextGivenNameMock,
		isRequired: false,
		label: 'Journal Path',
		size: 'large',
		prefix: 'https://publicknowledgeproject.com/',
	},
};

export const EditingOptIn = {
	args: {
		...FieldBaseMock,
		...FieldTextGivenNameMock,
		isRequired: false,
		label: 'Copyright Holder',
		optIntoEdit: true,
		optIntoEditLabel: 'Override',
	},
};
