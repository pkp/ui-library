import FieldTextarea from './FieldTextarea.vue';
import FieldBaseMock from '../mocks/field-base';
import FieldTextareaMetatagsMock from '../mocks/field-textarea-metatags';

export default {
	title: 'Forms/FieldTextarea',
	component: FieldTextarea,
	render: (args) => ({
		components: {FieldTextarea},
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
			<FieldTextarea v-bind="args" @change="change" />
		`,
	}),
};

export const Base = {
	args: {
		...FieldBaseMock,
		...FieldTextareaMetatagsMock,
	},
};

export const Small = {
	args: {
		...FieldBaseMock,
		...FieldTextareaMetatagsMock,
		label: 'Mailing Address',
		size: 'small',
	},
};

export const Large = {
	args: {
		...FieldBaseMock,
		...FieldTextareaMetatagsMock,
		label: 'References',
		size: 'large',
	},
};
