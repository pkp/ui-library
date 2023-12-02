import HelpButton from './HelpButton.vue';
export default {
	title: 'Components/HelpButton',
	component: HelpButton,
};

export const Default = {
	render: (args) => ({
		components: {HelpButton},
		setup() {
			return {args};
		},
		template: `
			<HelpButton v-bind="args" />
		`,
	}),
	args: {
		topic: 'settings',
		section: 'workflow-library',
		label: 'Learn more about the Publisher Library',
	},
};
