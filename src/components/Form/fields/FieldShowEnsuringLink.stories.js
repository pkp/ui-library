import FieldShowEnsuringLink from './FieldShowEnsuringLink.vue';
import FieldBaseMock from '../mocks/field-base';
import FieldShowEnsuringLinkMock from '../mocks/field-show-ensuring-link';

export default {
	title: 'Forms/FieldShowEnsuringLink',
	component: FieldShowEnsuringLink,
	render: (args) => ({
		components: {FieldShowEnsuringLink},
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
			<FieldShowEnsuringLink v-bind="args" @change="change" />
		`,
	}),
};

export const Base = {
	args: {...FieldBaseMock, ...FieldShowEnsuringLinkMock},
};
