import ShowMore from './ShowMore.vue';

export default {title: 'Components/ShowMore', component: ShowMore};

export const Primary = {
	render: (args) => ({
		components: {ShowMore},
		setup() {
			return {args};
		},
		template: '<ShowMore v-bind="args">Hello</ShowMore>',
	}),
	args: {
		label: 'Show more details',
	},
};
