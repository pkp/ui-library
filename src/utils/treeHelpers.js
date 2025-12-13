/**
 * Helper to find and remove item from tree
 */
export const findAndRemove = (items, id) => {
	for (let i = 0; i < items.length; i++) {
		if (items[i].id === id) {
			return items.splice(i, 1)[0];
		}
		if (items[i].children) {
			const found = findAndRemove(items[i].children, id);
			if (found) return found;
		}
	}
	return null;
};

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
