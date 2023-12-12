import FieldPubId from './FieldPubId.vue';
import FieldBaseMock from '../mocks/field-base';
import FieldUrnMock from '../mocks/field-urn';

export default {
	title: 'Forms/FieldPubId',
	component: FieldPubId,
	render: (args) => ({
		components: {FieldPubId},
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
			<FieldPubId v-bind="args" @change="change" />
		`,
	}),
};

export const Base = {
	args: {...FieldBaseMock, ...FieldUrnMock},
};
