import FieldArchivingPn from './FieldArchivingPn.vue';

import FieldBaseMock from '../mocks/field-base';
import FieldArchivingPnMock from '../mocks/field-archiving-pn';

export default {
	title: 'Forms/FieldArchivingPn',
	component: FieldArchivingPn,
	render: (args) => ({
		components: {FieldArchivingPn},
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
			<FieldArchivingPn v-bind="args" @change="change" />
		`,
	}),
};

export const Default = {
	args: {
		...FieldBaseMock,
		...FieldArchivingPnMock,
	},
};
