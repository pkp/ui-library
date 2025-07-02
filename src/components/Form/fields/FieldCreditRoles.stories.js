import FieldCreditRoles from './FieldCreditRoles.vue';
import FieldCreditRolesMock from '@/components/Form/mocks/field-credit-roles';

export default {
	title: 'Forms/FieldCreditRoles',
	component: FieldCreditRoles,
	render: (args) => ({
		components: {FieldCreditRoles},
		setup() {
			function change(name, prop, newValue, localeKey) {
				args[prop] = newValue;
			}

			return {args, change};
		},
		template: '<FieldCreditRoles v-bind="args" @change="change"/>',
	}),
	parameters: {
		docs: {
			story: {
				height: '500px',
			},
		},
	},
};

export const Base = {
	args: {...FieldCreditRolesMock},
};
