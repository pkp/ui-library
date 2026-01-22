import {ref, computed} from 'vue';

/**
 * @typedef {Object} NavigationMenuItem
 * @property {string|number} id - Unique identifier for the item
 * @property {string} label - Display label for the item
 * @property {boolean} [isVisible] - Whether the item is visible
 * @property {boolean} [hasError] - Whether the item has an error
 * @property {NavigationMenuItem[]} [children] - Child items (up to 3 levels deep)
 */

/**
 * @typedef {'before' | 'after' | 'child'} DropPosition
 */

/**
 * @typedef {Object} DropIndicator
 * @property {string|number} targetId - ID of the target item
 * @property {DropPosition} position - Where the item will be dropped
 * @property {number} level - Nesting level of the target
 */

const MAX_DEPTH = 3;

/**
 * Composable for managing a navigation menu tree with drag-and-drop functionality
 *
 * @param {Object} options
 * @param {import('vue').Ref<NavigationMenuItem[]>} options.assignedItems - Items in the assigned list
 * @param {import('vue').Ref<NavigationMenuItem[]>} options.unassignedItems - Items in the unassigned list
 * @param {Function} [options.onUpdate] - Callback when items are updated
 * @returns {Object}
 */
export function useNavigationMenuTree(options) {
	const {
		assignedItems: sourceAssignedItems,
		unassignedItems: sourceUnassignedItems,
		onUpdate,
	} = options;

	// Working copies for editing
	const workingAssignedItems = ref([]);
	const workingUnassignedItems = ref([]);
	const isEditing = ref(false);

	// Drag state
	const draggedItem = ref(null);
	const dragSource = ref(null); // 'assigned' | 'unassigned'
	const dropIndicator = ref(null);

	/**
	 * Get the current items based on editing state
	 */
	const assignedItems = computed(() => {
		return isEditing.value
			? workingAssignedItems.value
			: sourceAssignedItems.value;
	});

	const unassignedItems = computed(() => {
		return isEditing.value
			? workingUnassignedItems.value
			: sourceUnassignedItems.value;
	});

	/**
	 * Start editing mode - create working copies
	 */
	function startEditing() {
		workingAssignedItems.value = deepCloneItems(sourceAssignedItems.value);
		workingUnassignedItems.value = deepCloneItems(sourceUnassignedItems.value);
		isEditing.value = true;
	}

	/**
	 * Cancel editing - discard changes
	 */
	function cancelEditing() {
		workingAssignedItems.value = [];
		workingUnassignedItems.value = [];
		isEditing.value = false;
		clearDragState();
	}

	/**
	 * Save changes
	 */
	async function saveChanges() {
		if (onUpdate) {
			await onUpdate({
				assigned: workingAssignedItems.value,
				unassigned: workingUnassignedItems.value,
			});
		}
		isEditing.value = false;
		clearDragState();
	}

	/**
	 * Deep clone items array
	 */
	function deepCloneItems(items) {
		return items.map((item) => ({
			...item,
			children: item.children ? deepCloneItems(item.children) : [],
		}));
	}

	/**
	 * Get the depth of an item in the tree
	 */
	function getItemDepth(items, targetId, currentDepth = 1) {
		for (const item of items) {
			if (item.id === targetId) {
				return currentDepth;
			}
			if (item.children?.length) {
				const found = getItemDepth(item.children, targetId, currentDepth + 1);
				if (found !== -1) {
					return found;
				}
			}
		}
		return -1;
	}

	/**
	 * Get the maximum depth of a subtree
	 */
	function getSubtreeDepth(item, currentDepth = 1) {
		if (!item.children?.length) {
			return currentDepth;
		}
		return Math.max(
			...item.children.map((child) => getSubtreeDepth(child, currentDepth + 1)),
		);
	}

	/**
	 * Check if a drop would exceed the maximum depth
	 */
	function wouldExceedMaxDepth(draggedItem, targetDepth, position) {
		const draggedSubtreeDepth = getSubtreeDepth(draggedItem);
		let newDepth;

		if (position === 'child') {
			newDepth = targetDepth + draggedSubtreeDepth;
		} else {
			newDepth = targetDepth + draggedSubtreeDepth - 1;
		}

		return newDepth > MAX_DEPTH;
	}

	/**
	 * Find and remove an item from a tree
	 * @returns {NavigationMenuItem|null} The removed item
	 */
	function removeItemFromTree(items, itemId) {
		for (let i = 0; i < items.length; i++) {
			if (items[i].id === itemId) {
				return items.splice(i, 1)[0];
			}
			if (items[i].children?.length) {
				const removed = removeItemFromTree(items[i].children, itemId);
				if (removed) {
					return removed;
				}
			}
		}
		return null;
	}

	/**
	 * Find an item in a tree
	 */
	function findItemInTree(items, itemId) {
		for (const item of items) {
			if (item.id === itemId) {
				return item;
			}
			if (item.children?.length) {
				const found = findItemInTree(item.children, itemId);
				if (found) {
					return found;
				}
			}
		}
		return null;
	}

	/**
	 * Find parent of an item
	 */
	function findParentInTree(items, itemId, parent = null) {
		for (const item of items) {
			if (item.id === itemId) {
				return parent;
			}
			if (item.children?.length) {
				const found = findParentInTree(item.children, itemId, item);
				if (found !== undefined) {
					return found;
				}
			}
		}
		return undefined;
	}

	/**
	 * Insert item at position
	 */
	function insertItemAtPosition(items, targetId, item, position) {
		for (let i = 0; i < items.length; i++) {
			if (items[i].id === targetId) {
				if (position === 'before') {
					items.splice(i, 0, item);
					return true;
				} else if (position === 'after') {
					items.splice(i + 1, 0, item);
					return true;
				} else if (position === 'child') {
					if (!items[i].children) {
						items[i].children = [];
					}
					items[i].children.push(item);
					return true;
				}
			}
			if (items[i].children?.length) {
				const inserted = insertItemAtPosition(
					items[i].children,
					targetId,
					item,
					position,
				);
				if (inserted) {
					return true;
				}
			}
		}
		return false;
	}

	/**
	 * Flatten children of an item (for moving to unassigned)
	 */
	function flattenItem(item) {
		const result = [{...item, children: []}];
		if (item.children?.length) {
			for (const child of item.children) {
				result.push(...flattenItem(child));
			}
		}
		return result;
	}

	/**
	 * Handle drag start
	 */
	function handleDragStart(item, source) {
		draggedItem.value = item;
		dragSource.value = source;
	}

	/**
	 * Handle drag over - update drop indicator
	 */
	function handleDragOver(targetItem, position, targetSource) {
		if (!draggedItem.value) return;

		// Can't drop on self or descendant
		if (draggedItem.value.id === targetItem.id) {
			dropIndicator.value = null;
			return;
		}

		// Check if target is a descendant of dragged item
		if (findItemInTree([draggedItem.value], targetItem.id)) {
			dropIndicator.value = null;
			return;
		}

		// Calculate target depth
		let targetDepth = 1;
		if (targetSource === 'assigned') {
			targetDepth = getItemDepth(
				isEditing.value
					? workingAssignedItems.value
					: sourceAssignedItems.value,
				targetItem.id,
			);
		}

		// Check max depth constraint
		if (
			targetSource === 'assigned' &&
			wouldExceedMaxDepth(draggedItem.value, targetDepth, position)
		) {
			dropIndicator.value = null;
			return;
		}

		// Unassigned items are always flat
		if (targetSource === 'unassigned' && position === 'child') {
			dropIndicator.value = null;
			return;
		}

		dropIndicator.value = {
			targetId: targetItem.id,
			position,
			level: position === 'child' ? targetDepth + 1 : targetDepth,
		};
	}

	/**
	 * Handle drop
	 */
	function handleDrop(targetItem, position, targetSource) {
		if (!draggedItem.value) return;

		// Don't allow dropping on self
		if (draggedItem.value.id === targetItem.id) {
			clearDragState();
			return;
		}

		const sourceItems =
			dragSource.value === 'assigned'
				? workingAssignedItems.value
				: workingUnassignedItems.value;

		const targetItems =
			targetSource === 'assigned'
				? workingAssignedItems.value
				: workingUnassignedItems.value;

		// Remove from source
		const removed = removeItemFromTree(sourceItems, draggedItem.value.id);
		if (!removed) return;

		// Handle different drop scenarios
		if (targetSource === 'unassigned') {
			// Dropping into unassigned list - always flat
			const itemsToInsert =
				dragSource.value === 'assigned' ? flattenItem(removed) : [removed];

			const targetIndex = targetItems.findIndex(
				(item) => item.id === targetItem.id,
			);
			if (targetIndex === -1) {
				// Target not found, append to end
				targetItems.push(...itemsToInsert);
			} else if (position === 'before') {
				targetItems.splice(targetIndex, 0, ...itemsToInsert);
			} else {
				// 'after' position
				targetItems.splice(targetIndex + 1, 0, ...itemsToInsert);
			}
		} else {
			// Dropping into assigned list - can be nested
			insertItemAtPosition(targetItems, targetItem.id, removed, position);
		}

		clearDragState();
	}

	/**
	 * Handle drop on empty area
	 */
	function handleDropOnEmpty(targetSource) {
		if (!draggedItem.value) return;

		const sourceItems =
			dragSource.value === 'assigned'
				? workingAssignedItems.value
				: workingUnassignedItems.value;

		const targetItems =
			targetSource === 'assigned'
				? workingAssignedItems.value
				: workingUnassignedItems.value;

		// Remove from source
		const removed = removeItemFromTree(sourceItems, draggedItem.value.id);
		if (!removed) return;

		// If moving from assigned to unassigned, flatten children
		if (dragSource.value === 'assigned' && targetSource === 'unassigned') {
			const flattened = flattenItem(removed);
			targetItems.push(...flattened);
		} else {
			targetItems.push(removed);
		}

		clearDragState();
	}

	/**
	 * Clear drag state
	 */
	function clearDragState() {
		draggedItem.value = null;
		dragSource.value = null;
		dropIndicator.value = null;
	}

	/**
	 * Move item up within its sibling list
	 */
	function moveUp(itemId, source) {
		const items =
			source === 'assigned'
				? workingAssignedItems.value
				: workingUnassignedItems.value;

		moveItemInList(items, itemId, -1);
	}

	/**
	 * Move item down within its sibling list
	 */
	function moveDown(itemId, source) {
		const items =
			source === 'assigned'
				? workingAssignedItems.value
				: workingUnassignedItems.value;

		moveItemInList(items, itemId, 1);
	}

	/**
	 * Move item in list by direction
	 */
	function moveItemInList(items, itemId, direction) {
		for (let i = 0; i < items.length; i++) {
			if (items[i].id === itemId) {
				const newIndex = i + direction;
				if (newIndex >= 0 && newIndex < items.length) {
					const temp = items[i];
					items[i] = items[newIndex];
					items[newIndex] = temp;
				}
				return true;
			}
			if (items[i].children?.length) {
				const found = moveItemInList(items[i].children, itemId, direction);
				if (found) return true;
			}
		}
		return false;
	}

	return {
		// State
		assignedItems,
		unassignedItems,
		isEditing,
		draggedItem,
		dragSource,
		dropIndicator,

		// Editing
		startEditing,
		cancelEditing,
		saveChanges,

		// Drag and drop
		handleDragStart,
		handleDragOver,
		handleDrop,
		handleDropOnEmpty,
		clearDragState,

		// Item operations
		moveUp,
		moveDown,

		// Utilities
		getItemDepth,
		findItemInTree,
		findParentInTree,
	};
}
