/**
 * Helper to find item object in tree
 */
export const findItem = (items, id) => {
	if (!items) return null;
	for (const item of items) {
		if (item.id === id) return item;
		if (item.children) {
			const found = findItem(item.children, id);
			if (found) return found;
		}
	}
	return null;
};

/**
 * Helper to remove item from tree (immutable)
 * Returns a new array with the item removed
 */
export const removeItem = (items, id) => {
	return items.reduce((acc, item) => {
		if (item.id === id) {
			return acc;
		}
		if (item.children) {
			const newChildren = removeItem(item.children, id);
			if (newChildren !== item.children) {
				return [...acc, {...item, children: newChildren}];
			}
		}
		return [...acc, item];
	}, []);
};

/**
 * Helper to insert item into tree (immutable)
 * Returns a new array with the item inserted
 */
export const insertItem = (items, parentId, index, itemToInsert) => {
	if (parentId === null) {
		// Insert at root
		const newItems = [...items];
		newItems.splice(index, 0, itemToInsert);
		return newItems;
	}

	return items.map((item) => {
		if (item.id === parentId) {
			const newChildren = item.children ? [...item.children] : [];
			newChildren.splice(index, 0, itemToInsert);
			return {...item, children: newChildren};
		}
		if (item.children) {
			const newChildren = insertItem(
				item.children,
				parentId,
				index,
				itemToInsert,
			);
			if (newChildren !== item.children) {
				return {...item, children: newChildren};
			}
		}
		return item;
	});
};

/**
 * Helper to find parent info (id and list)
 */
export const findParentInfo = (items, id, parentId) => {
	if (!items) return null;
	for (let i = 0; i < items.length; i++) {
		if (items[i].id === id) {
			return {parentId, index: i, list: items};
		}
		if (items[i].children) {
			const result = findParentInfo(items[i].children, id, items[i].id);
			if (result) return result;
		}
	}
	return null;
};

/**
 * Helper to enforce max depth
 */
export const enforceMaxDepth = (items, currentLevel, maxLevel) => {
	let result = [];
	for (const item of items) {
		result.push(item);

		if (item.children && item.children.length > 0) {
			if (currentLevel >= maxLevel) {
				// We are at or beyond max level, children must be flattened
				const flattenedChildren = enforceMaxDepth(
					item.children,
					currentLevel + 1,
					maxLevel,
				);
				result.push(...flattenedChildren);
				item.children = [];
			} else {
				// Recurse
				item.children = enforceMaxDepth(
					item.children,
					currentLevel + 1,
					maxLevel,
				);
			}
		}
	}
	return result;
};

/**
 * Helper to check if childId is a descendant of parentItem
 */
export const isDescendant = (parentItem, childId) => {
	if (!parentItem || !parentItem.children) return false;
	for (const child of parentItem.children) {
		if (child.id === childId) return true;
		if (isDescendant(child, childId)) return true;
	}
	return false;
};

/**
 * Helper to flatten tree for form submission
 */
export const flattenForForm = (items, parentId = null) => {
	let result = {};
	items.forEach((item, index) => {
		result[item.id] = {
			seq: index,
			parentId: parentId,
		};
		if (item.children) {
			Object.assign(result, flattenForForm(item.children, item.id));
		}
	});
	return result;
};
