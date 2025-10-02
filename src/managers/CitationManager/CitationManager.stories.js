import CitationManager from './CitationManager.vue';

export default {
	title: 'Managers/CitationManager',
	component: CitationManager,
	render: (args) => ({
		components: {CitationManager},
		setup() {
			return {args};
		},
		template: `<CitationManager v-bind="args"/>`,
	}),
};

export const Base = {
	args: {},
};
