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

	const triggerDataChange = injectFromCurrentInstance('triggerDataChange') || () => {};

	return {triggerDataChange};
}
