import {useModalStore} from '@/stores/modalStore';

/**
 * Provides functions for managing modal dialogs and side panels
 */
export function useModal() {
	const modalStore = useModalStore();

	/**
	 * Open a dialog modal
	 * @param {Object} props - Properties for the dialog
	 * @param {string} props.title - Dialog title
	 * @param {string} [props.message] - Dialog message
	 * @param {Object} [props.actions] - Actions configuration for the dialog
	 */
	function openDialog(props) {
		modalStore.openDialog(props);
	}

	/**
	 * Open a side modal component
	 * @param {Object|string} component - The component to render in the side modal
	 * @param {Object} [props] - Properties to pass to the component
	 * @param {Object} [opts] - Additional options for the side modal
	 */
	function openSideModal(component, props, opts) {
		modalStore.openSideModal(component, props, opts);
	}

	/**
	 * Open a network error dialog
	 * @param {Object} fetchError - The error object from a failed fetch operation
	 */
	function openDialogNetworkError(fetchError) {
		modalStore.openDialogNetworkError(fetchError);
	}

	/**
	 * Close a side modal
	 * @param {Object|string} component - The component to close
	 */
	function closeSideModal(component) {
		modalStore.closeSideModal(component);
	}

	/**
	 * Check if a side modal is currently open
	 * @param {Object|string} component - The component to check
	 * @returns {boolean} True if the side modal is open
	 */
	function isSideModalOpened(component) {
		return modalStore.isSideModalOpened(component);
	}

	return {
		openDialog,
		openSideModal,
		openDialogNetworkError,
		closeSideModal,
		isSideModalOpened,
	};
}
