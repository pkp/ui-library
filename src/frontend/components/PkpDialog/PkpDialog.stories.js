import PkpDialog from './PkpDialog.vue';

export default {
	title: 'PkpDialog',
	component: PkpDialog,
	render: (args) => ({
		components: {PkpDialog},
		setup() {
			return {args};
		},
		template: '<PkpDialog v-bind="args"></PkpDialog>',
	}),
};

export const Primary = {args: {title: 'title test'}};
