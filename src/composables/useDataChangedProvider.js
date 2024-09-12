import {provide} from 'vue';

export function useDataChangedProvider(callback) {
	let callbacks = [];

	function registerDataChangeCallback(callback) {
		callbacks.push(callback);
	}

	function unRegisterDataChangeCallback(_callback) {
		callbacks = callbacks.filter((callback) => callback !== _callback);
	}

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
