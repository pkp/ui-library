import {ref} from 'vue';

export function useContainerStateManager() {
	const components = ref({});

	/**
	 * Get a component by its key
	 *
	 * @param {String} key
	 * @return {Object}
	 */
	function get(key) {
		return components.value[key] ? components.value[key] : {};
	}

	/**
	 * Set data for a component
	 *
	 * Existing keys in the component that are not passed in the data
	 * argument will not be modified or removed.
	 *
	 * @param {String} key
	 * @param {Array} data Key/value object with new data
	 */
	function set(key, data) {
		let component = {...get(key)};
		Object.keys(data).forEach(function (dataKey) {
			component[dataKey] = data[dataKey];
		});
		components.value[key] = component;
	}

	return {components, get, set};
}
