import {useModalStore} from '@/stores/modalStore';

export function useModal() {
	const modalStore = useModalStore();

	function openDialog(props) {
		modalStore.openDialog(props);
	}

	function openSideModal(component, props, opts) {
		modalStore.openSideModal(component, props, opts);
	}

	return {openDialog, openSideModal};
}
