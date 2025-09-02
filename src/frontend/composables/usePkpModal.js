import {usePkpModalStore} from '@/frontend/stores/pkpModalStore';

/**
 * Provides functions for managing modal dialogs and side panels
 */
export function usePkpModal() {
	const modalStore = usePkpModalStore();

	/**
	 * Open a side modal component
	 * @param {Object} [props] - Properties to pass to the component
 	 * @param {string} [props.message] - message
	 * @param {Object} [props.actions] - Actions configuration

	 * @param {Object} [opts] - Additional options for the side modal
	 */
	function openDialog(props, opts) {
		modalStore.openDialog(props, opts);
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
	function closeTopDialog() {
		modalStore.closeTopDialog();
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
		openDialogNetworkError,
		closeTopDialog,
		isModalOpened,
	};
}
