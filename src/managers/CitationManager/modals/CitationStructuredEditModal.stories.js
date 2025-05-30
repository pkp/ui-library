import CitationStructuredEditModal from './CitationStructuredEditModal.vue';

export default {
	title: 'Managers/CitationManager/CitationStructuredEditModal',
	component: CitationStructuredEditModal,
};

export const Base = {
	render: (args) => ({
		components: {
			CitationStructuredEditModal,
		},
		setup() {
			return {};
		},
		template: '<CitationStructuredEditModal></CitationStructuredEditModal>',
	}),
	args: {},
	play: async ({canvasElement}) => {},
	decorators: [
		() => ({
			template: '<div style="height: 300px"><story/></div>',
		}),
	],
};
