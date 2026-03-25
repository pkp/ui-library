import {provide} from 'vue';

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
	 * When called with close data from a modal, only triggers if data actually changed.
	 * When called with no arguments, always triggers (direct call after a known mutation).
	 *
	 * @param {Object} [closeData] - Optional close data from modal, checked for dataChanged flag
	 * @returns {Promise<Array>} Promise resolving to an array of results from all callbacks
	 */
	async function triggerDataChange(closeData) {
		if (closeData !== undefined) {
			const dc = closeData?.dataChanged;
			if (!dc || (Array.isArray(dc) && dc.length === 0)) {
				return;
			}
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
