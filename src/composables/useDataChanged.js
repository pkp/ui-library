export function useDataChanged() {
	const callbacks = [];
	function registerDataChangeCallback(callback) {
		callbacks.push(callback);
	}
	function triggerDataChange() {
		callbacks.forEach((callback) => callback());
	}

	return {registerDataChangeCallback, triggerDataChange};
}
