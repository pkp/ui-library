import {toRef, ref, computed} from 'vue';

export function useSideMenu(_items, _activeItemKey = '', _expandedKeys = {}) {
	const itemsRef = toRef(_items);
	if (typeof itemsRef.value === 'undefined') {
		throw new Error('items must be provided to use this api');
	}

	const items = computed(() => mapItems(itemsRef.value));
	const expandedKeys = ref(_expandedKeys);
	const activeItemKey = ref(_activeItemKey);

	function updateExpandedKeys(_expandedKeys) {
		expandedKeys.value = _expandedKeys;
	}

	function findItemByKey(items, key) {
		if (!items?.length || !key) {
			return null;
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

		return null;
	}

	function setExpandedKeys(keys = []) {
		// reset expandedKeys
		expandedKeys.value = {};

		keys.forEach((key) => (expandedKeys.value[key] = true));
		return expandedKeys;
	}

	function setActiveItemKey(key = '') {
		activeItemKey.value = key;
	}

	// Maps the level attributes which are necessary to render the nested menu
	function mapItems(_items, level = 1) {
		const result = [];

		_items.forEach((_item, index) => {
			const item = {
				..._item,
				level,
				index,
			};

			if (_item.items) {
				item.items = mapItems(_item.items, level + 1);
			}

			if (level === 1 && item.link && !_item.items) {
				item.command = () => {
					window.location.href = item.link;
				};
			}

			result.push(item);
		});

		return result;
	}

	const sideMenuProps = computed(() => ({
		items: items.value,
		expandedKeys: expandedKeys.value,
		activeItemKey: activeItemKey.value,
		'onUpdate:expandedKeys': updateExpandedKeys,
		'onUpdate:activeItemKey': setActiveItemKey,
	}));

	const selectedItem = computed(() =>
		findItemByKey(items.value, activeItemKey.value),
	);

	return {
		sideMenuProps,
		updateExpandedKeys,
		setExpandedKeys,
		setActiveItemKey,
		selectedItem,
	};
}
