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

export const Primary = {
	args: {
		open: true,
		buttonName: 'Basic Example',
		name: 'basic',
		title: 'Submit Article',
		message: 'Are you sure you want to submit this article?',
		actions: [
			{
				label: 'Confirm',
				isPrimary: true,
				callback: (close) => {
					// Simulate a server request
					setTimeout(() => close(), 2000);
				},
			},
			{
				label: 'Cancel',
				isSeconadary: true,
				callback: (close) => close(),
			},
		],
		modalStyle: 'basic',
	},
};
