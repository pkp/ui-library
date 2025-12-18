/**
 * Navigation Menu Builder Utilities
 *
 * Tree manipulation functions for the navigation menu builder.
 * Supports up to 3 levels of nesting (level 0, 1, 2).
 */

/**
 * @typedef {Object} MenuItem
 * @property {number} id - Unique identifier
 * @property {string} title - Display title
 * @property {string} type - Menu item type (e.g., 'NMI_TYPE_CUSTOM')
 * @property {string} [conditionalWarning] - Warning message for conditional display
 * @property {MenuItem[]} [children] - Nested menu items
 */

/**
 * @typedef {Object} Instruction
 * @property {'reorder-above'|'reorder-below'|'make-child'|'reparent'} type
 * @property {number} [currentLevel]
 * @property {number} [indentPerLevel]
 * @property {number} [desiredLevel]
 */

/**
 * @typedef {Object} TreeAction
 * @property {'instruction'} type
 * @property {Instruction} instruction
 * @property {number} itemId
 * @property {number} targetId
 */

export const MAX_DEPTH = 2; // 0, 1, 2 = 3 levels

/**
 * Tree manipulation utilities
 */
export const tree = {
	/**
	 * Find an item by ID in the tree
	 * @param {MenuItem[]} data - Tree data
	 * @param {number} itemId - Item ID to find
	 * @returns {MenuItem|undefined}
	 */
	find(data, itemId) {
		for (const item of data) {
			if (item.id === itemId) {
				return item;
			}
			if (this.hasChildren(item)) {
				const result = this.find(item.children, itemId);
				if (result) {
					return result;
				}
			}
		}
		return undefined;
	},

	/**
	 * Check if an item has children
	 * @param {MenuItem} item
	 * @returns {boolean}
	 */
	hasChildren(item) {
		return Array.isArray(item.children) && item.children.length > 0;
	},

	/**
	 * Get the depth level of an item in the tree
	 * @param {MenuItem[]} data - Tree data
	 * @param {number} itemId - Item ID to find
	 * @param {number} [currentLevel=0] - Current depth level
	 * @returns {number} - Depth level or -1 if not found
	 */
	getItemLevel(data, itemId, currentLevel = 0) {
		for (const item of data) {
			if (item.id === itemId) {
				return currentLevel;
			}
			if (this.hasChildren(item)) {
				const result = this.getItemLevel(
					item.children,
					itemId,
					currentLevel + 1,
				);
				if (result !== -1) {
					return result;
				}
			}
		}
		return -1;
	},

	/**
	 * Get the maximum depth of an item's subtree
	 * @param {MenuItem} item
	 * @param {number} [currentDepth=0]
	 * @returns {number}
	 */
	getSubtreeDepth(item, currentDepth = 0) {
		if (!this.hasChildren(item)) {
			return currentDepth;
		}
		let maxDepth = currentDepth;
		for (const child of item.children) {
			const childDepth = this.getSubtreeDepth(child, currentDepth + 1);
			if (childDepth > maxDepth) {
				maxDepth = childDepth;
			}
		}
		return maxDepth;
	},

	/**
	 * Remove an item from the tree by ID
	 * @param {MenuItem[]} data - Tree data
	 * @param {number} itemId - Item ID to remove
	 * @returns {MenuItem[]} - New tree without the item
	 */
	remove(data, itemId) {
		return data
			.filter((item) => item.id !== itemId)
			.map((item) => {
				if (this.hasChildren(item)) {
					return {
						...item,
						children: this.remove(item.children, itemId),
					};
				}
				return item;
			});
	},

	/**
	 * Insert an item before a target item
	 * @param {MenuItem[]} data - Tree data
	 * @param {number} targetId - Target item ID
	 * @param {MenuItem} newItem - Item to insert
	 * @returns {MenuItem[]}
	 */
	insertBefore(data, targetId, newItem) {
		return data.flatMap((item) => {
			if (item.id === targetId) {
				return [newItem, item];
			}
			if (this.hasChildren(item)) {
				return {
					...item,
					children: this.insertBefore(item.children, targetId, newItem),
				};
			}
			return item;
		});
	},

	/**
	 * Insert an item after a target item
	 * @param {MenuItem[]} data - Tree data
	 * @param {number} targetId - Target item ID
	 * @param {MenuItem} newItem - Item to insert
	 * @returns {MenuItem[]}
	 */
	insertAfter(data, targetId, newItem) {
		return data.flatMap((item) => {
			if (item.id === targetId) {
				return [item, newItem];
			}
			if (this.hasChildren(item)) {
				return {
					...item,
					children: this.insertAfter(item.children, targetId, newItem),
				};
			}
			return item;
		});
	},

	/**
	 * Insert an item as the first child of a target item
	 * @param {MenuItem[]} data - Tree data
	 * @param {number} targetId - Target item ID
	 * @param {MenuItem} newItem - Item to insert
	 * @returns {MenuItem[]}
	 */
	insertChild(data, targetId, newItem) {
		return data.map((item) => {
			if (item.id === targetId) {
				return {
					...item,
					children: [newItem, ...(item.children ?? [])],
				};
			}
			if (this.hasChildren(item)) {
				return {
					...item,
					children: this.insertChild(item.children, targetId, newItem),
				};
			}
			return item;
		});
	},

	/**
	 * Get the path of parent IDs to reach an item
	 * @param {MenuItem[]} data - Tree data
	 * @param {number} targetId - Target item ID
	 * @param {number[]} [parentIds=[]] - Accumulated parent IDs
	 * @returns {number[]|undefined}
	 */
	getPathToItem(data, targetId, parentIds = []) {
		for (const item of data) {
			if (item.id === targetId) {
				return parentIds;
			}
			if (this.hasChildren(item)) {
				const nested = this.getPathToItem(item.children, targetId, [
					...parentIds,
					item.id,
				]);
				if (nested) {
					return nested;
				}
			}
		}
		return undefined;
	},

	/**
	 * Flatten an item and all its descendants into a flat array
	 * @param {MenuItem} item - Item to flatten
	 * @returns {MenuItem[]} - Flat array of items without children property
	 */
	flattenItem(item) {
		const result = [{...item, children: undefined}];
		if (this.hasChildren(item)) {
			for (const child of item.children) {
				result.push(...this.flattenItem(child));
			}
		}
		return result;
	},

	/**
	 * Flatten entire tree into flat array
	 * @param {MenuItem[]} data - Tree data
	 * @returns {MenuItem[]}
	 */
	flattenTree(data) {
		const result = [];
		for (const item of data) {
			result.push(...this.flattenItem(item));
		}
		return result;
	},

	/**
	 * Clone an item without children
	 * @param {MenuItem} item
	 * @returns {MenuItem}
	 */
	cloneWithoutChildren(item) {
		const clone = {...item};
		delete clone.children;
		return clone;
	},
};

/**
 * Check if a move would exceed the maximum nesting depth
 * @param {MenuItem} item - Item being moved
 * @param {number} targetLevel - Level of the target position
 * @param {boolean} asChild - Whether inserting as child (adds 1 to level)
 * @returns {boolean} - True if move would exceed max depth
 */
export function wouldExceedMaxDepth(item, targetLevel, asChild = false) {
	const insertLevel = asChild ? targetLevel + 1 : targetLevel;
	const subtreeDepth = tree.getSubtreeDepth(item);
	const totalDepth = insertLevel + subtreeDepth;
	return totalDepth > MAX_DEPTH;
}

/**
 * Update the tree based on a drag-and-drop action
 * @param {MenuItem[]} data - Current tree data
 * @param {TreeAction} action - The action to perform
 * @returns {MenuItem[]|null} - Updated tree or null if action invalid
 */
export function updateTree(data, action) {
	if (action.type !== 'instruction') {
		return data;
	}

	const item = tree.find(data, action.itemId);
	if (!item) {
		return data;
	}

	const instruction = action.instruction;

	// Can't drop on itself
	if (action.itemId === action.targetId) {
		return data;
	}

	if (instruction.type === 'reparent') {
		const path = tree.getPathToItem(data, action.targetId);
		if (!path) {
			console.error('Could not find path to target');
			return data;
		}

		const desiredId = path[instruction.desiredLevel];
		if (desiredId === undefined) {
			// Moving to root level
			let result = tree.remove(data, action.itemId);
			result = [...result, tree.cloneWithoutChildren(item)];
			return result;
		}

		let result = tree.remove(data, action.itemId);
		result = tree.insertAfter(
			result,
			desiredId,
			tree.cloneWithoutChildren(item),
		);
		return result;
	}

	if (instruction.type === 'reorder-above') {
		let result = tree.remove(data, action.itemId);
		result = tree.insertBefore(
			result,
			action.targetId,
			tree.cloneWithoutChildren(item),
		);
		return result;
	}

	if (instruction.type === 'reorder-below') {
		let result = tree.remove(data, action.itemId);
		result = tree.insertAfter(
			result,
			action.targetId,
			tree.cloneWithoutChildren(item),
		);
		return result;
	}

	if (instruction.type === 'make-child') {
		// Check max depth constraint
		const targetLevel = tree.getItemLevel(data, action.targetId);
		if (wouldExceedMaxDepth(item, targetLevel, true)) {
			console.warn('Cannot nest: would exceed maximum depth of', MAX_DEPTH);
			return data;
		}

		let result = tree.remove(data, action.itemId);
		result = tree.insertChild(
			result,
			action.targetId,
			tree.cloneWithoutChildren(item),
		);
		return result;
	}

	console.warn('Unhandled instruction type:', instruction.type);
	return data;
}

/**
 * Move an item from assigned tree to unassigned list
 * Flattens any children and adds them to unassigned as well
 * @param {MenuItem[]} assignedItems - Current assigned tree
 * @param {MenuItem[]} unassignedItems - Current unassigned list
 * @param {number} itemId - Item to move
 * @returns {{assigned: MenuItem[], unassigned: MenuItem[]}}
 */
export function moveToUnassigned(assignedItems, unassignedItems, itemId) {
	const item = tree.find(assignedItems, itemId);
	if (!item) {
		return {assigned: assignedItems, unassigned: unassignedItems};
	}

	// Flatten the item and its children
	const flattenedItems = tree.flattenItem(item);

	// Remove from assigned
	const assigned = tree.remove(assignedItems, itemId);

	// Add all flattened items to unassigned
	const unassigned = [...unassignedItems, ...flattenedItems];

	return {assigned, unassigned};
}

/**
 * Move an item from unassigned list to assigned tree
 * @param {MenuItem[]} assignedItems - Current assigned tree
 * @param {MenuItem[]} unassignedItems - Current unassigned list
 * @param {number} itemId - Item to move
 * @param {number|null} [targetId=null] - Target item ID to insert near (null = append to root)
 * @param {'before'|'after'|'child'} [position='after'] - Where to insert relative to target
 * @returns {{assigned: MenuItem[], unassigned: MenuItem[]}}
 */
export function moveToAssigned(
	assignedItems,
	unassignedItems,
	itemId,
	targetId = null,
	position = 'after',
) {
	const item = unassignedItems.find((i) => i.id === itemId);
	if (!item) {
		return {assigned: assignedItems, unassigned: unassignedItems};
	}

	// Remove from unassigned
	const unassigned = unassignedItems.filter((i) => i.id !== itemId);

	// Add to assigned
	let assigned;
	const itemWithoutChildren = tree.cloneWithoutChildren(item);

	if (targetId === null) {
		// Append to root
		assigned = [...assignedItems, itemWithoutChildren];
	} else if (position === 'before') {
		assigned = tree.insertBefore(assignedItems, targetId, itemWithoutChildren);
	} else if (position === 'child') {
		// Check max depth
		const targetLevel = tree.getItemLevel(assignedItems, targetId);
		if (targetLevel + 1 > MAX_DEPTH) {
			// Can't nest, append to root instead
			assigned = [...assignedItems, itemWithoutChildren];
		} else {
			assigned = tree.insertChild(assignedItems, targetId, itemWithoutChildren);
		}
	} else {
		assigned = tree.insertAfter(assignedItems, targetId, itemWithoutChildren);
	}

	return {assigned, unassigned};
}

/**
 * Convert tree structure to flat menuTree format for form submission
 * @param {MenuItem[]} items - Tree structure
 * @param {number|null} [parentId=null] - Parent item ID
 * @param {number} [startSeq=0] - Starting sequence number
 * @returns {{menuTree: Object, nextSeq: number}}
 */
export function treeToMenuTree(items, parentId = null, startSeq = 0) {
	const menuTree = {};
	let seq = startSeq;

	for (const item of items) {
		menuTree[item.id] = {
			seq: seq++,
			...(parentId !== null && {parentId}),
		};

		if (tree.hasChildren(item)) {
			const childResult = treeToMenuTree(item.children, item.id, seq);
			Object.assign(menuTree, childResult.menuTree);
			seq = childResult.nextSeq;
		}
	}

	return {menuTree, nextSeq: seq};
}

/**
 * Convert flat menuTree format to tree structure
 * @param {MenuItem[]} allItems - All available menu items (flat)
 * @param {Object} menuTree - Menu tree data from form {itemId: {seq, parentId?}}
 * @returns {{assigned: MenuItem[], unassigned: MenuItem[]}}
 */
export function menuTreeToTree(allItems, menuTree) {
	const assignedIds = new Set(Object.keys(menuTree).map(Number));
	const itemMap = new Map(allItems.map((item) => [item.id, {...item}]));

	// Build tree structure
	const rootItems = [];
	const childrenMap = new Map();

	// Sort by sequence
	const sortedEntries = Object.entries(menuTree).sort(
		([, a], [, b]) => a.seq - b.seq,
	);

	for (const [itemIdStr, data] of sortedEntries) {
		const itemId = Number(itemIdStr);
		const item = itemMap.get(itemId);
		if (!item) continue;

		const itemCopy = {...item, children: []};

		if (data.parentId) {
			if (!childrenMap.has(data.parentId)) {
				childrenMap.set(data.parentId, []);
			}
			childrenMap.get(data.parentId).push(itemCopy);
		} else {
			rootItems.push(itemCopy);
		}

		itemMap.set(itemId, itemCopy);
	}

	// Attach children to parents
	for (const [parentId, children] of childrenMap) {
		const parent = itemMap.get(parentId);
		if (parent) {
			parent.children = children;
		}
	}

	// Clean up empty children arrays
	const cleanTree = (items) =>
		items.map((item) => {
			if (item.children?.length === 0) {
				const clone = {...item};
				delete clone.children;
				return clone;
			}
			return {...item, children: cleanTree(item.children)};
		});

	const assigned = cleanTree(rootItems);
	const unassigned = allItems
		.filter((item) => !assignedIds.has(item.id))
		.map((item) => tree.cloneWithoutChildren(item));

	return {assigned, unassigned};
}
