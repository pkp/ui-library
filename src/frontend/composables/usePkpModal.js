import {usePkpModalStore} from '@/frontend/stores/pkpModalStore';

/**
 * Provides functions for managing modal dialogs and side panels
 */
export function usePkpModal() {
	const modalStore = usePkpModalStore();

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
	 * Close the currently opened dialog modal
	 */
	function closeDialog() {
		modalStore.closeDialog();
	}

	/**
	 * Open a side modal component
	 * @param {Object|string} component - The component to render in the side modal
	 * @param {Object} [props] - Properties to pass to the component
	 * @param {Object} [opts] - Additional options for the side modal
	 */
	function openModal(component, props, opts) {
		modalStore.openModal(component, props, opts);
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
	function closeModal(component) {
		modalStore.closeModal(component);
	}

	/**
	 * Check if a side modal is currently open
	 * @param {Object|string} component - The component to check
	 * @returns {boolean} True if the side modal is open
	 */
	function isModalOpened(component) {
		return modalStore.isModalOpened(component);
	}

	return {
		openDialog,
		closeDialog,
		openModal,
		openDialogNetworkError,
		closeModal,
		isModalOpened,
	};
}
