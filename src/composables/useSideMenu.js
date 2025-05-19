import {toRef, ref, computed} from 'vue';
import {useQueryParams} from '@/composables/useQueryParams';

/**
 * Provides functions and props for managing side menu state and interactions
 * @param {Array|Ref<Array>} _items - Menu items array or ref
 * @param {Object} [opts={}] - Configuration options
 * @param {string} [opts.activeItemKey=''] - Initial active item key
 * @param {Object} [opts.expandedKeys={}] - Initial expanded keys
 * @param {Function} [opts.onActionFn=()=>{}] - Function to call when an action item is clicked
 */
export function useSideMenu(_items, opts = {}) {
	const queryParams = useQueryParams();

	const _activeItemKey = opts.activeItemKey || '';
	const _expandedKeys = opts.expandedKeys || {};
	const onActionFn = opts.onActionFn || (() => {});
	const itemsRef = toRef(_items);

	if (typeof itemsRef.value === 'undefined') {
		throw new Error('items must be provided to use this api');
	}

	/**
	 * Processed menu items with added level information and command handlers
	 * @type {ComputedRef<Array>}
	 */
	const items = computed(() => {
		return mapItems(itemsRef.value);
	});

	/**
	 * Object tracking which menu items are expanded
	 * @type {Ref<Object>}
	 */
	const expandedKeys = ref(_expandedKeys);

	/**
	 * Currently active menu item key
	 * @type {Ref<string>}
	 */
	const activeItemKey = ref(_activeItemKey);

	/**
	 * Update the expanded keys state
	 * @param {Object} _expandedKeys - New expanded keys object
	 */
	function updateExpandedKeys(_expandedKeys) {
		expandedKeys.value = _expandedKeys;
	}

	/**
	 * Find a menu item by its key
	 * @param {Array} items - Menu items to search in
	 * @param {string} key - The key to find
	 * @returns {Object|null} The found item or null
	 */
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

	/**
	 * Set which menu items are expanded
	 * @param {Array<string>} [keys=[]] - Keys of items to expand
	 * @returns {Ref<Object>} Updated expanded keys object
	 */
	function setExpandedKeys(keys = []) {
		// reset expandedKeys
		expandedKeys.value = {};

		keys.forEach((key) => (expandedKeys.value[key] = true));
		return expandedKeys;
	}

	/**
	 * Find the parent keys for an item
	 * @param {Array} items - Menu items to search in
	 * @param {string} key - The key to find parents for
	 * @param {Array<string>} [parents=[]] - Accumulated parent keys
	 * @returns {Array<string>|null} Array of parent keys or null if not found
	 */
	function findParentKeys(items, key, parents = []) {
		for (const item of items) {
			// if item key matches the active key, return the item parents
			if (item.key === key) {
				return parents;
			}

			// if the item has nested items, continue searching
			if (item.items) {
				const result = findParentKeys(item.items, key, [...parents, item.key]);
				if (result) {
					return result;
				}
			}
		}

		// if the key was not found, return null
		return null;
	}

	/**
	 * Set the active menu item and expand parent items
	 * @param {string} [key=''] - Key of the item to set as active
	 * @returns {boolean} True if the item was found and set, false otherwise
	 */
	function setActiveItemKey(key = '') {
		if (!findItemByKey(items.value, key)) {
			return false;
		}

		activeItemKey.value = key;
		const parentKeys = findParentKeys(items.value, key);
		if (parentKeys) {
			setExpandedKeys([...parentKeys, ...Object.keys(expandedKeys.value)]);
		}
		return true;
	}

	/**
	 * Compare two URLs to see if they point to the same path
	 * @param {string} url1 - First URL to compare
	 * @param {string} url2 - Second URL to compare
	 * @returns {boolean} True if URLs have the same hostname and pathname
	 */
	function compareUrlPaths(url1, url2) {
		const parsedUrl1 = isValidURL(url1) ? new URL(url1) : false;
		const parsedUrl2 = isValidURL(url2) ? new URL(url2) : false;
		return (
			parsedUrl1 &&
			parsedUrl2 &&
			parsedUrl1.pathname === parsedUrl2.pathname &&
			parsedUrl1.hostname === parsedUrl2.hostname
		);
	}

	/**
	 * Process menu items to add level information and command handlers
	 * @param {Array} __items - Original menu items to process
	 * @param {number} [level=1] - Current nesting level
	 * @returns {Array} Processed menu items
	 */
	function mapItems(__items, level = 1) {
		const result = [];

		__items.forEach((_item, index) => {
			const item = {
				..._item,
				level,
				index,
			};

			if (_item.items) {
				item.items = mapItems(_item.items, level + 1);
			}

			if (item.link) {
				item.command = () => {
					if (compareUrlPaths(window.location.href, item.link)) {
						// only update query params, without reloading page, important for dashboards
						const parsedUrl = new URL(item.link);
						const params = new URLSearchParams(parsedUrl.search);
						for (const [key, value] of params) {
							queryParams[key] = value;
						}
					} else {
						window.location.href = item.link;
					}
					setActiveItemKey(item.key);
				};
			} else if (item.action) {
				item.command = () => {
					onActionFn(item.action, {...item.actionArgs, key: item.key});
					if (item.state) {
						setActiveItemKey(item.key);
					}
				};
			} else if (item.state) {
				item.command = () => {
					setActiveItemKey(item.key);
				};
			}

			result.push(item);
		});

		return result;
	}

	/**
	 * Check if a string is a valid URL
	 * @param {string} string - The string to check
	 * @returns {boolean} True if the string is a valid URL
	 */
	function isValidURL(string) {
		try {
			new URL(string);
			return true;
		} catch (_) {
			return false;
		}
	}

	/**
	 * Props to pass to the SideMenu component
	 * @type {ComputedRef<Object>}
	 */
	const sideMenuProps = computed(() => ({
		items: items.value,
		expandedKeys: expandedKeys.value,
		activeItemKey: activeItemKey.value,
		'onUpdate:expandedKeys': updateExpandedKeys,
		'onUpdate:activeItemKey': setActiveItemKey,
	}));

	/**
	 * The currently selected menu item
	 * @type {ComputedRef<Object|null>}
	 */
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
