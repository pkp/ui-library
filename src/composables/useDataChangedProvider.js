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
	 * Trigger data change event, calling all registered callback functions
	 * @returns {Promise<Array>} Promise resolving to an array of results from all callbacks
	 */
	async function triggerDataChange() {
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
