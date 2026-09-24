import {provide} from 'vue';
import {shouldTriggerDataChange} from './useDataChanged';

/**
 * Provides functions to manage data change events and callbacks
 * @param {Function} [callback] - An initial callback to register
 */
export function useDataChangedProvider(callback) {
	let callbacks = [];

	/**
	 * Register a callback function to be called when data changes
	 * @param {Function} callback - The function to call when data changes
	 */
	function registerDataChangeCallback(callback) {
		callbacks.push(callback);
	}

	/**
	 * Unregister a previously registered callback function
	 * @param {Function} _callback - The function to unregister
	 */
	function unRegisterDataChangeCallback(_callback) {
		callbacks = callbacks.filter((callback) => callback !== _callback);
	}

	/**
	 * Trigger data change event, calling all registered callback functions.
	 *
	 * Pass it as a side modal's `onClose` and it reloads only when something changed in that modal.
	 * Call it with no arguments after a change you already know about, and it always reloads.
	 *
	 * @param {Object} [closeData] - Close data from a side modal, when used as its `onClose`
	 * @returns {Promise<Array>} Promise resolving to an array of results from all callbacks
	 */
	async function triggerDataChange(closeData) {
		if (closeData !== undefined && !shouldTriggerDataChange(closeData)) {
			return;
		}
		return Promise.all(callbacks.map((callback) => callback()));
	}

	if (callback) {
		registerDataChangeCallback(callback);
	}

	provide('registerDataChangeCallback', registerDataChangeCallback);
	provide('unRegisterDataChangeCallback', unRegisterDataChangeCallback);

	provide('triggerDataChange', triggerDataChange);

	return {triggerDataChange};
}
