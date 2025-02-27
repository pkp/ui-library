import {onUnmounted} from 'vue';
import {injectFromCurrentInstance} from '@/utils/defineComponentStore';

export function useDataChanged(callback) {
	if (callback) {
		const registerDataChangeCallback = injectFromCurrentInstance(
			'registerDataChangeCallback',
		);
		registerDataChangeCallback(callback);

		const unRegisterDataChangeCallback = injectFromCurrentInstance(
			'unRegisterDataChangeCallback',
		);

		onUnmounted(() => {
			unRegisterDataChangeCallback(callback);
		});
	}

	const triggerDataChange = injectFromCurrentInstance('triggerDataChange');

	return {triggerDataChange};
}
