import {ref} from 'vue';
import cloneDeep from 'clone-deep';

/**
 * Generate a unique key for menu items
 * @param {Object} item - The menu item
 * @returns {string}
 */
export function getItemKey(item) {
	return `nav-menu-item-${item.id}`;
}

/**
 * Find an item by ID in a tree structure
 * @param {Array} items - Array of items to search
 * @param {number|string} id - ID to find
 * @returns {Object|null}
 */
export function findItemById(items, id) {
	for (const item of items) {
		if (item.id === id) {
			return item;
		}
		if (item.children?.length > 0) {
			const found = findItemById(item.children, id);
			if (found) return found;
		}
	}
	return null;
}

/**
 * Find parent of an item by ID
 * @param {Array} items - Array of items to search
 * @param {number|string} id - ID of child item
 * @param {Object} parent - Current parent (for recursion)
 * @returns {Object|null}
 */
export function findParentById(items, id, parent = null) {
	for (const item of items) {
		if (item.id === id) {
			return parent;
		}
		if (item.children?.length > 0) {
			const found = findParentById(item.children, id, item);
			if (found !== undefined) return found;
		}
	}
	return undefined;
}

/**
 * Remove an item from the tree by ID
 * @param {Array} items - Array of items
 * @param {number|string} id - ID to remove
 * @returns {Object|null} The removed item
 */
export function removeItemById(items, id) {
	for (let i = 0; i < items.length; i++) {
		if (items[i].id === id) {
			return items.splice(i, 1)[0];
		}
		if (items[i].children?.length > 0) {
			const removed = removeItemById(items[i].children, id);
			if (removed) return removed;
		}
	}
	return null;
}

/**
 * Insert an item at a specific position
 * @param {Array} items - Array to insert into
 * @param {Object} item - Item to insert
 * @param {number} index - Position to insert at
 */
export function insertItemAt(items, item, index) {
	const clampedIndex = Math.max(0, Math.min(index, items.length));
	items.splice(clampedIndex, 0, item);
}

/**
 * Calculate the depth of an item (for nested items)
 * @param {Object} item - The item to check
 * @returns {number}
 */
export function calculateItemDepth(item) {
	if (!item.children || item.children.length === 0) {
		return 1;
	}
	return 1 + Math.max(...item.children.map(calculateItemDepth));
}

/**
 * Flatten children when moving to unassigned
 * @param {Object} item - Item with potential children
 * @returns {Array} Array of flattened items
 */
export function flattenItem(item) {
	const items = [item];

	if (item.children?.length > 0) {
		for (const child of item.children) {
			items.push(...flattenItem(child));
		}
		item.children = [];
	}

	return items;
}

/**
 * Check if moving would exceed max depth
 * @param {Object} item - Item being moved
 * @param {number} targetLevel - Target level (1-based)
 * @param {number} maxDepth - Maximum allowed depth
 * @returns {boolean}
 */
export function wouldExceedMaxDepth(item, targetLevel, maxDepth) {
	const itemDepth = calculateItemDepth(item);
	return targetLevel + itemDepth - 1 > maxDepth;
}

/**
 * Generate tree data from flat menu items
 * @param {Array} flatItems - Flat array of menu items
 * @returns {Array} Tree structure
 */
export function generateMenuTreeData(flatItems) {
	const itemMap = new Map();
	const roots = [];

	// First pass: create map of all items
	flatItems.forEach((item) => {
		itemMap.set(item.id, {
			...item,
			children: [],
		});
	});

	// Second pass: build tree structure
	flatItems.forEach((item) => {
		const treeItem = itemMap.get(item.id);
		if (item.parentId && itemMap.has(item.parentId)) {
			itemMap.get(item.parentId).children.push(treeItem);
		} else {
			roots.push(treeItem);
		}
	});

	return roots;
}

/**
 * Flatten tree data back to flat array with parentId references
 * @param {Array} treeItems - Tree structure
 * @param {number|string|null} parentId - Parent ID for recursion
 * @returns {Array} Flat array with parentId and seq
 */
export function flattenTreeData(treeItems, parentId = null) {
	const result = [];

	treeItems.forEach((item, index) => {
		result.push({
			...item,
			parentId,
			seq: index,
			children: undefined,
		});

		if (item.children?.length > 0) {
			result.push(...flattenTreeData(item.children, item.id));
		}
	});

	return result;
}

/**
 * Composable for managing navigation menu tree state
 */
export function useNavigationMenuTree(
	initialAssigned = [],
	initialUnassigned = [],
) {
	const assignedItems = ref(cloneDeep(initialAssigned));
	const unassignedItems = ref(cloneDeep(initialUnassigned));

	/**
	 * Move an item within or between trees
	 */
	function moveItem({
		itemId,
		sourceTreeId,
		targetTreeId,
		targetParentId,
		targetIndex,
	}) {
		// Get source and target arrays
		const sourceItems =
			sourceTreeId === 'assigned' ? assignedItems : unassignedItems;
		const targetItems =
			targetTreeId === 'assigned' ? assignedItems : unassignedItems;

		// Remove item from source
		const item = removeItemById(sourceItems.value, itemId);
		if (!item) return false;

		// If moving to unassigned, flatten children
		if (targetTreeId === 'unassigned') {
			const flattened = flattenItem(item);

			// Add all flattened items to unassigned
			flattened.forEach((flatItem, i) => {
				insertItemAt(
					targetItems.value,
					flatItem,
					targetIndex !== undefined
						? targetIndex + i
						: targetItems.value.length,
				);
			});
		} else {
			// Moving to assigned (or within assigned)
			if (targetParentId) {
				// Inserting as child of another item
				const parent = findItemById(targetItems.value, targetParentId);
				if (parent) {
					if (!parent.children) parent.children = [];
					insertItemAt(
						parent.children,
						item,
						targetIndex !== undefined ? targetIndex : parent.children.length,
					);
				}
			} else {
				// Inserting at root level
				insertItemAt(
					targetItems.value,
					item,
					targetIndex !== undefined ? targetIndex : targetItems.value.length,
				);
			}
		}

		return true;
	}

	/**
	 * Reset trees to initial state
	 */
	function reset(newAssigned, newUnassigned) {
		assignedItems.value = cloneDeep(newAssigned);
		unassignedItems.value = cloneDeep(newUnassigned);
	}

	/**
	 * Get serialized data for saving
	 */
	function getSerializedData() {
		return {
			assigned: flattenTreeData(assignedItems.value),
			unassigned: flattenTreeData(unassignedItems.value),
		};
	}

	return {
		assignedItems,
		unassignedItems,
		moveItem,
		reset,
		getSerializedData,
		findItemById: (id) =>
			findItemById(assignedItems.value, id) ||
			findItemById(unassignedItems.value, id),
	};
}
