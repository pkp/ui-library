import {onUnmounted} from 'vue';
import {injectFromCurrentInstance} from '@/utils/defineComponentStore';

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

	let triggerDataChange = injectFromCurrentInstance('triggerDataChange');
	// to work fine even outside of the data change provider
	if (!triggerDataChange) {
		triggerDataChange = () => {};
	}

	return {triggerDataChange};
}
