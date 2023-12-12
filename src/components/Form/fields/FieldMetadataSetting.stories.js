import FieldMetadataSetting from './FieldMetadataSetting.vue';
import FieldBaseMock from '../mocks/field-base';
import FieldMetadataMock from '../mocks/field-metadata';

export default {
	title: 'Forms/FieldMetadataSetting',
	component: FieldMetadataSetting,
	render: (args) => ({
		components: {FieldMetadataSetting},
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
			<FieldMetadataSetting v-bind="args" @change="change" />
		`,
	}),
};

export const Base = {
	args: {...FieldBaseMock, ...FieldMetadataMock},
};
