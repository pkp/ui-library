import {useModalStore} from '@/stores/modalStore';

export function useModal() {
	const modalStore = useModalStore();

	function openDialog(props) {
		modalStore.openDialog(props);
	}

	function openSideModal(component, props) {
		modalStore.openSideModal(component, props);
	}

	return {openDialog, openSideModal};
}
