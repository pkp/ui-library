import {useModalStore} from '@/stores/modalStore';

export function useModal() {
	const modalStore = useModalStore();

	function openDialog(props) {
		modalStore.openDialog(props);
	}

	function openSideModal(component, props, opts) {
		modalStore.openSideModal(component, props, opts);
	}

	function openDialogNetworkError(fetchError) {
		modalStore.openDialogNetworkError(fetchError);
	}

	function closeSideModal(component) {
		modalStore.closeSideModal(component);
	}

	function isSideModalOpened(component) {
		modalStore.isSideModalOpened(component);
	}

	return {
		openDialog,
		openSideModal,
		openDialogNetworkError,
		closeSideModal,
		isSideModalOpened,
	};
}
