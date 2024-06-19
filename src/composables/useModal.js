import {useModalStore} from '@/stores/modalStore';

export function useModal() {
	const modalStore = useModalStore();

	function openDialog(props) {
		modalStore.openDialog(props);
	}

	function openSideModal(component, props, opts) {
		modalStore.openSideModal(component, props, opts);
	}

	function closeSideModal(component) {
		console.log('useModal, closeSideModal');
		modalStore.closeSideModal(component);
	}

	return {openDialog, openSideModal, closeSideModal};
}
