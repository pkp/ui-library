import '@/styles/frontend-theme.css';
import {ref} from 'vue';
import PkpDialog from '../PkpDialog.vue';
import PkpButton from '../../PkpButton/PkpButton.vue';

export default {
	title: 'Frontend/PkpDialog',
	component: PkpDialog,
};

export const Primary = {
	render: (args) => ({
		components: {PkpDialog, PkpButton},
		setup() {
			const isOpen = ref(false);
			const open = () => (isOpen.value = true);
			const close = () => (isOpen.value = false);
			return {args, isOpen, open, close};
		},
		template: `
			<div>
				<PkpButton @click="open">Open Dialog</PkpButton>
				<PkpDialog
					v-bind="args"
					:opened="isOpen"
					@close="close"
				/>
			</div>
		`,
	}),
	args: {
		title: 'Submit Article',
		message: 'Are you sure you want to submit this article?',
		actions: [
			{
				label: 'Confirm',
				isPrimary: true,
				callback: (close) => {
					setTimeout(() => close(), 1000);
				},
			},
			{
				label: 'Cancel',
				callback: (close) => close(),
			},
		],
	},
};
