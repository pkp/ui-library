import Comments from './Comments.vue';

export default {
	title: 'Comments',
	component: Comments,
	render: (args) => ({
		components: {Comments},
		setup() {
			return {args};
		},
		template: '<Comments v-bind="args"></Comments>',
	}),
};

export const Primary = {};
