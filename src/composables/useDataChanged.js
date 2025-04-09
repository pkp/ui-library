import {onUnmounted} from 'vue';
import {injectFromCurrentInstance} from '@/utils/defineComponentStore';

/**
 * Provides functions to react to data changes or trigger data change events
 * @param {Function} [callback] - Function to call when data changes occur
 */
export function useDataChanged(callback) {
	if (callback) {
		const registerDataChangeCallback = injectFromCurrentInstance(
			'registerDataChangeCallback',
		);
		if (registerDataChangeCallback) {
			registerDataChangeCallback(callback);
		}

		const unRegisterDataChangeCallback = injectFromCurrentInstance(
			'unRegisterDataChangeCallback',
		);

		onUnmounted(() => {
			if (unRegisterDataChangeCallback) {
				unRegisterDataChangeCallback(callback);
			}
		});
	}

	/**
	 * Function to trigger a data change event
	 * @type {Function}
	 */
	let triggerDataChange = injectFromCurrentInstance('triggerDataChange');
	// to work fine even outside of the data change provider
	if (!triggerDataChange) {
		triggerDataChange = () => {};
	}

	return {triggerDataChange};
}
