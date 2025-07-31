import {within, userEvent} from 'storybook/test';
import {onUnmounted} from 'vue';
import TopNavActions from './TopNavActions.vue';
import PkpButton from '@/components/Button/Button.vue';
import SideModalBody from '@/components/Modal/SideModalBody.vue';
import SideModalLayoutBasic from '@/components/Modal/SideModalLayoutBasic.vue';
import {useModal} from '@/composables/useModal.js';

export default {
	title: 'Components/TopNavActions',
	component: TopNavActions,
};

export const Main = {
	render: () => ({
		components: {TopNavActions},
		template: `
			<div
				class="flex h-12 items-center justify-end bg-selection-dark px-4"
			>
				<TopNavActions />
			</div>
		`,
	}),
};

const SideModalBase = {
	components: {SideModalBody, SideModalLayoutBasic},
	template: `
		<SideModalBody>
			<SideModalLayoutBasic>CONTENT</SideModalLayoutBasic>
		</SideModalBody>
	`,
};

export const SideModal = {
	render: (args) => ({
		components: {PkpButton, SideModalBase},
		setup() {
			const {openSideModal, closeSideModal} = useModal();

			function openModal() {
				openSideModal(SideModalBase, {});
			}

			onUnmounted(() => {
				closeSideModal(SideModalBase); // Close modal when switching stories
			});

			return {openModal};
		},
		template: `
			<PkpButton @click="openModal">
				Open Modal
			</PkpButton>
		`,
	}),
	args: {},
	play: async ({canvasElement}) => {
		// Assigns canvas to the component root element
		const canvas = within(canvasElement);
		const user = userEvent.setup();

		await user.click(canvas.getByText('Open Modal'));
	},
};
