import {inject, onUnmounted} from 'vue';
export function useDataChanged(callback) {
	if (callback) {
		const registerDataChangeCallback = inject('registerDataChangeCallback');
		registerDataChangeCallback(callback);

		const unRegisterDataChangeCallback = inject('unRegisterDataChangeCallback');

		onUnmounted(() => {
			unRegisterDataChangeCallback(callback);
		});
	}

	const triggerDataChange = inject('triggerDataChange');

	return {triggerDataChange};
}
