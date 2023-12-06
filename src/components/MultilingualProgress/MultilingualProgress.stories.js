import MultilingualProgress from './MultilingualProgress.vue';
export default {
	title: 'Components/MultilingualProgress',
	component: MultilingualProgress,
};

export const Default = {
	render: (args) => ({
		components: {MultilingualProgress},
		setup() {
			return {args};
		},
		template: `
			<MultilingualProgress v-bind="args" />
		`,
	}),

	args: {
		count: 1,
		total: 3,
	},
};
