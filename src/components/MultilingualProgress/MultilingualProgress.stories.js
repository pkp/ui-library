import multilingualProgress from './multilingualProgress.vue';
export default {
	title: 'Components/multilingualProgress',
	component: multilingualProgress,
};

export const Default = {
	render: (args) => ({
		components: {multilingualProgress},
		setup() {
			return {args};
		},
		template: `
			<multilingual-progress v-bind="args" />
		`,
	}),

	args: {
		count: 1,
		total: 3,
	},
};
