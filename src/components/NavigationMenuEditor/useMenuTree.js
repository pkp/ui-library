import {ref, computed} from 'vue';
import cloneDeep from 'clone-deep';

/**
 * Composable for managing hierarchical menu tree data
 * @param {Array} initialItems - Initial tree items
 * @returns {Object} Tree management API
 */
export function useMenuTree(initialItems = []) {
	const items = ref(cloneDeep(initialItems));
	const expandedIds = ref(new Set());

	/**
	 * Find an item by ID (recursive search)
	 * @param {string|number} id - Item ID to find
	 * @param {Array} nodes - Nodes to search (defaults to root items)
	 * @returns {Object|null} Found item or null
	 */
	function findItemById(id, nodes = items.value) {
		for (const node of nodes) {
			if (node.id === id) {
				return node;
			}
			if (node.children?.length) {
				const found = findItemById(id, node.children);
				if (found) {
					return found;
				}
			}
		}
		return null;
	}

	/**
	 * Find the parent of an item by ID
	 * @param {string|number} id - Child item ID
	 * @param {Array} nodes - Nodes to search
	 * @param {Object|null} parent - Current parent context
	 * @returns {Object|null} Parent item or null if root level
	 */
	function findParentById(id, nodes = items.value, parent = null) {
		for (const node of nodes) {
			if (node.id === id) {
				return parent;
			}
			if (node.children?.length) {
				const found = findParentById(id, node.children, node);
				if (found !== undefined) {
					return found;
				}
			}
		}
		return undefined;
	}

	/**
	 * Get the index of an item within its parent's children array
	 * @param {string|number} id - Item ID
	 * @returns {number} Index or -1 if not found
	 */
	function getItemIndex(id) {
		const parent = findParentById(id);
		const siblings = parent ? parent.children : items.value;
		return siblings.findIndex((item) => item.id === id);
	}

	/**
	 * Get the maximum depth of an item's subtree (how many levels of children it has)
	 * @param {string|number} id - Item ID
	 * @returns {number} Subtree depth (0 = no children, 1 = has children, 2 = has grandchildren, etc.)
	 */
	function getSubtreeDepth(id) {
		const item = findItemById(id);
		if (!item) return 0;

		function measureDepth(node) {
			if (!node.children?.length) return 0;
			let maxChildDepth = 0;
			for (const child of node.children) {
				const childDepth = measureDepth(child);
				maxChildDepth = Math.max(maxChildDepth, childDepth);
			}
			return 1 + maxChildDepth;
		}

		return measureDepth(item);
	}

	/**
	 * Check if targetId is a descendant of ancestorId
	 * @param {string|number} targetId - Potential descendant ID
	 * @param {string|number} ancestorId - Potential ancestor ID
	 * @returns {boolean} True if targetId is a descendant of ancestorId
	 */
	function isDescendantOf(targetId, ancestorId) {
		const ancestor = findItemById(ancestorId);
		if (!ancestor || !ancestor.children?.length) {
			return false;
		}

		function checkChildren(children) {
			for (const child of children) {
				if (child.id === targetId) {
					return true;
				}
				if (child.children?.length && checkChildren(child.children)) {
					return true;
				}
			}
			return false;
		}

		return checkChildren(ancestor.children);
	}

	/**
	 * Add an item to the tree at a specific position
	 * @param {Object} item - Item to add
	 * @param {string|number|null} parentId - Parent item ID (null for root)
	 * @param {number} index - Position index (-1 for append)
	 */
	function addItem(item, parentId = null, index = -1) {
		const newItem = {
			...cloneDeep(item),
			parentId,
			children: item.children || [],
		};

		let targetArray;
		if (parentId === null) {
			targetArray = items.value;
		} else {
			const parent = findItemById(parentId);
			if (!parent) {
				console.warn(`Parent with id ${parentId} not found`);
				return;
			}
			if (!parent.children) {
				parent.children = [];
			}
			targetArray = parent.children;
		}

		if (index === -1 || index >= targetArray.length) {
			targetArray.push(newItem);
		} else {
			targetArray.splice(Math.max(0, index), 0, newItem);
		}
	}

	/**
	 * Remove an item from the tree
	 * @param {string|number} id - Item ID to remove
	 * @returns {Object|null} Removed item with its children
	 */
	function removeItem(id) {
		const parent = findParentById(id);
		const siblings = parent ? parent.children : items.value;
		const index = siblings.findIndex((item) => item.id === id);

		if (index === -1) {
			return null;
		}

		const [removed] = siblings.splice(index, 1);
		expandedIds.value.delete(id);
		return removed;
	}

	/**
	 * Move an item within the tree
	 * @param {string|number} itemId - Item to move
	 * @param {string|number|null} targetParentId - New parent ID
	 * @param {number} index - New position index
	 */
	function moveItem(itemId, targetParentId, index) {
		const item = removeItem(itemId);
		if (item) {
			addItem(item, targetParentId, index);
		}
	}

	/**
	 * Flatten an item and all its descendants into a flat array
	 * @param {string|number} id - Item ID to flatten
	 * @returns {Array} Flat array of items
	 */
	function flattenItem(id) {
		const item = findItemById(id);
		if (!item) {
			return [];
		}

		const result = [];

		function collectItems(node) {
			result.push({
				...node,
				parentId: null,
				children: [],
			});
			if (node.children?.length) {
				node.children.forEach(collectItems);
			}
		}

		collectItems(item);
		return result;
	}

	return {
		items: computed(() => items.value),
		findItemById,
		findParentById,
		getItemIndex,
		getSubtreeDepth,
		isDescendantOf,
		addItem,
		removeItem,
		moveItem,
		flattenItem,
	};
}

/**
 * Compute a flat preview of what the dragged subtree would look like after truncation.
 * Each entry has {id, title, depth} where depth is clamped to maxDepth.
 * @param {Object} item - The dragged item (with children)
 * @param {number} targetDepth - The depth the item would land at
 * @param {number} maxDepth - Maximum allowed depth
 * @returns {Array<{id, title, depth}>} Flat list of preview entries
 */
export function computeDropPreview(item, targetDepth, maxDepth) {
	const preview = [];

	function walk(node, levelInSubtree) {
		const effectiveDepth = Math.min(targetDepth + levelInSubtree, maxDepth);
		preview.push({id: node.id, title: node.title, depth: effectiveDepth});
		if (node.children?.length) {
			for (const child of node.children) {
				walk(child, levelInSubtree + 1);
			}
		}
	}

	walk(item, 0);
	return preview;
}
