import {ref, computed} from 'vue';

export function useSideMenu(
	_activeItemKey = '',
	_expandedKeys = {},
	items = [],
) {
	const expandedKeys = ref(_expandedKeys);
	const activeItemKey = ref(_activeItemKey);

	function updateExpandedKeys(_expandedKeys) {
		expandedKeys.value = _expandedKeys;
	}

	function findItemByKey(items, key) {
		if (!items?.length || !key) {
			return undefined;
		}

		for (const item of items) {
			// Check if the current item matches the key
			if (item.key === key) {
				return item;
			}

			// If the item has nested items, search within them recursively
			if (item.items) {
				const foundItem = findItemByKey(item.items, key);
				if (foundItem) {
					return foundItem;
				}
			}
		}

		return undefined;
	}

	const setExpandedKeys = (keys = []) => {
		// reset expandedKeys
		expandedKeys.value = {};

		keys.forEach((key) => (expandedKeys.value[key] = true));
		return expandedKeys;
	};

	const setActiveItemKey = (key = '') => {
		activeItemKey.value = key;
	};

	const getItemByKey = (key) => {
		return findItemByKey(items, key);
	};

	const sideMenuProps = computed(() => ({
		'onUpdate:expandedKeys': updateExpandedKeys,
		'onUpdate:activeItemKey': setActiveItemKey,
		expandedKeys: expandedKeys.value,
		activeItemKey: activeItemKey.value,
	}));

	return {
		sideMenuProps,
		updateExpandedKeys,
		setExpandedKeys,
		setActiveItemKey,
		getItemByKey,
	};
}
