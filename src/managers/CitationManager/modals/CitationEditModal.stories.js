import CitationEditModal from './CitationEditModal.vue';
import PkpButton from '@/components/Button/Button.vue';
import {useModal} from '@/composables/useModal';

export default {
	title: 'Managers/CitationManager/modals/CitationEditModal',
	component: CitationEditModal,
};

export const Base = {
	render: (args) => ({
		components: {
			CitationEditModal,
			PkpButton,
		},
		setup() {
			const {openSideModal} = useModal();

			function openEditStructuredModal() {
				openSideModal(CitationEditModal, args.modalProps);
			}

			function openEditRawModal() {
				openSideModal(CitationEditModal, args.modalProps);
			}
			return {
				openEditStructuredModal,
				openEditRawModal,
			};
		},
		template: `<PkpButton @click="openEditStructuredModal">Structured</PkpButton> <PkpButton @click="openEditRawModal">Raw</PkpButton>`,
	}),
	args: {
		modalProps: {
			title: 'Edit citation',
			form: {},
			citation: {},
		},
	},
	play: async ({canvasElement}) => {},
	decorators: [
		() => ({
			template: '<div style="height: 300px"><story/></div>',
		}),
	],
};
