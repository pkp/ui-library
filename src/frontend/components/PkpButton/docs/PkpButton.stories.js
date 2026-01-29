import PkpButton from '../PkpButton.vue';

export default {
	title: 'Frontend/PkpButton',
	component: PkpButton,
	render: (args) => ({
		components: {PkpButton},
		setup() {
			return {args};
		},
		template: '<PkpButton v-bind="args">{{ args.slot }}</PkpButton>',
	}),
};

export const Primary = {
	args: {
		slot: 'Submit',
		isDisabled: false,
	},
};

export const Disabled = {
	name: 'Disabled State',
	args: {
		slot: 'Submit',
		isDisabled: true,
	},
};
