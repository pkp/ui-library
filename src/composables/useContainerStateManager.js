import {ref} from 'vue';

/**
 * Provides functions to manage component state in a container
 */
export function useContainerStateManager() {
	/**
	 * Reactive object containing all component states
	 * @type {Ref<Object>}
	 */
	const components = ref({});

	/**
	 * Get a component by its key
	 *
	 * @param {String} key - Identifier for the component
	 * @return {Object} The component's state data or empty object if not found
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
	 * @param {String} key - Identifier for the component
	 * @param {Object} data - Key/value object with new data
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
