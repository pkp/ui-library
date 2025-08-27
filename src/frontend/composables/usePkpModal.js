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
	function openModal(props, opts) {
		modalStore.openModal(props, opts);
	}

	/**
	 * Open a network error dialog
	 * @param {Object} fetchError - The error object from a failed fetch operation
	 */
	function openModalNetworkError(fetchError) {
		modalStore.openModalNetworkError(fetchError);
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
		openModal,
		openModalNetworkError,
		closeModal,
		isModalOpened,
	};
}
