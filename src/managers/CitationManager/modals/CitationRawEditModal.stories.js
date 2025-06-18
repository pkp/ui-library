import CitationRawEditModal from './CitationRawEditModal.vue';

export default {
	title: 'Managers/CitationManager/CitationRawEditModal',
	component: CitationRawEditModal,
};

export const Base = {
	render: (args) => ({
		components: {
			CitationRawEditModal,
		},
		setup() {
			return {};
		},
		template: '<CitationRawEditModal></CitationRawEditModal>',
	}),
	args: {},
	play: async ({canvasElement}) => {},
	decorators: [
		() => ({
			template: '<div style="height: 300px"><story/></div>',
		}),
	],
};
