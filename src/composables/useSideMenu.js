import {ref} from 'vue';

export function useSideMenu(_activeItemKey = '', _expandedKeys = {}) {
	const expandedKeys = ref(_expandedKeys);
	const activeItemKey = ref(_activeItemKey);

	const setExpandedKeys = (keys = []) => {
		// reset expandedKeys
		expandedKeys.value = {};

		keys.forEach((key) => (expandedKeys.value[key] = true));
		return expandedKeys;
	};

	const setActiveItemKey = (key = '') => {
		activeItemKey.value = key;
	};

	return {
		expandedKeys,
		activeItemKey,
		setExpandedKeys,
		setActiveItemKey,
	};
}
