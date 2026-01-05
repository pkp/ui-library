import {computed} from 'vue';
import {useMenuTree} from './useMenuTree';
import {
	PANEL_ASSIGNED,
	PANEL_UNASSIGNED,
	DROP_REORDER_ABOVE,
	DROP_REORDER_BELOW,
	DROP_MAKE_CHILD,
	DEFAULT_MAX_DEPTH,
} from '../constants';

/**
 * Composable for NavigationMenuEditor component
 * Manages state for both assigned and unassigned menu items
 * @param {Object} options - Configuration options
 * @param {Array} options.assignedItems - Initial assigned items
 * @param {Array} options.unassignedItems - Initial unassigned items
 * @param {number} options.maxDepth - Maximum nesting depth (default: 3)
 * @returns {Object} State and actions for the editor
 */
export function useNavigationMenuEditor(options = {}) {
	const maxDepth = options.maxDepth || DEFAULT_MAX_DEPTH;

	// Initialize trees for both panels
	const assignedTree = useMenuTree(options.assignedItems || [], {maxDepth});
	const unassignedTree = useMenuTree(options.unassignedItems || [], {
		maxDepth: 1,
	});

	/**
	 * Handle move operation from drag and drop
	 * @param {Object} payload - Move payload from DND
	 */
	function handleMove(payload) {
		const {
			sourceId,
			sourcePanelId,
			targetId,
			targetPanelId,
			instruction,
			parentId: explicitParentId,
			index: explicitIndex,
		} = payload;

		// Cross-panel: Assigned -> Unassigned (flatten children)
		if (
			sourcePanelId === PANEL_ASSIGNED &&
			targetPanelId === PANEL_UNASSIGNED
		) {
			moveToUnassigned(sourceId, targetId, instruction, explicitIndex);
			return;
		}

		// Cross-panel: Unassigned -> Assigned
		if (
			sourcePanelId === PANEL_UNASSIGNED &&
			targetPanelId === PANEL_ASSIGNED
		) {
			moveToAssigned(
				sourceId,
				targetId,
				instruction,
				explicitParentId,
				explicitIndex,
			);
			return;
		}

		// Same panel: Assigned reorder
		if (sourcePanelId === PANEL_ASSIGNED && targetPanelId === PANEL_ASSIGNED) {
			reorderAssigned(
				sourceId,
				targetId,
				instruction,
				explicitParentId,
				explicitIndex,
			);
			return;
		}

		// Same panel: Unassigned reorder
		if (
			sourcePanelId === PANEL_UNASSIGNED &&
			targetPanelId === PANEL_UNASSIGNED
		) {
			reorderUnassigned(sourceId, targetId, instruction, explicitIndex);
		}
	}

	/**
	 * Move item from assigned to unassigned (flattening all children)
	 */
	function moveToUnassigned(sourceId, targetId, instruction, explicitIndex) {
		// Get all items (flatten the hierarchy)
		const flattenedItems = assignedTree.flattenItem(sourceId);

		// Remove from assigned tree
		assignedTree.removeItem(sourceId);

		// Determine insert position in unassigned
		let insertIndex;

		// Use explicit index if provided (from drop zone)
		if (explicitIndex !== undefined && explicitIndex !== null) {
			insertIndex = explicitIndex;
		} else if (targetId) {
			const targetIdx = unassignedTree.items.value.findIndex(
				(item) => item.id === targetId,
			);
			if (targetIdx !== -1) {
				insertIndex =
					instruction?.type === DROP_REORDER_ABOVE ? targetIdx : targetIdx + 1;
			} else {
				insertIndex = unassignedTree.items.value.length;
			}
		} else {
			insertIndex = unassignedTree.items.value.length;
		}

		// Add all flattened items to unassigned
		flattenedItems.forEach((item, i) => {
			unassignedTree.addItem(item, null, insertIndex + i);
		});
	}

	/**
	 * Move item from unassigned to assigned
	 */
	function moveToAssigned(
		sourceId,
		targetId,
		instruction,
		explicitParentId,
		explicitIndex,
	) {
		// Find and remove from unassigned
		const item = unassignedTree.removeItem(sourceId);
		if (!item) return;

		let parentId, index;

		// Use explicit values if provided (from drop zone)
		if (explicitIndex !== undefined && explicitIndex !== null) {
			parentId = explicitParentId ?? null;
			index = explicitIndex;
		} else {
			// Resolve from instruction
			const resolved = resolveDropPosition(assignedTree, targetId, instruction);
			parentId = resolved.parentId;
			index = resolved.index;
		}

		// Add to assigned tree
		assignedTree.addItem(item, parentId, index);
	}

	/**
	 * Reorder item within assigned panel
	 */
	function reorderAssigned(
		sourceId,
		targetId,
		instruction,
		explicitParentId,
		explicitIndex,
	) {
		// Don't move to self
		if (sourceId === targetId) return;

		let parentId, index;

		// Use explicit values if provided (from drop zone)
		if (explicitIndex !== undefined && explicitIndex !== null) {
			parentId = explicitParentId ?? null;
			index = explicitIndex;

			// Adjust index if source is before target in the same parent
			const sourceParent = assignedTree.findParentById(sourceId);
			const sourceParentId = sourceParent?.id ?? null;

			if (sourceParentId === parentId) {
				const sourceIdx = assignedTree.getItemIndex(sourceId);
				if (sourceIdx < index) {
					index--;
				}
			}
		} else {
			// Resolve from instruction
			const resolved = resolveDropPosition(assignedTree, targetId, instruction);
			parentId = resolved.parentId;
			index = resolved.index;
		}

		// Move within tree
		assignedTree.moveItem(sourceId, parentId, index);
	}

	/**
	 * Reorder item within unassigned panel
	 */
	function reorderUnassigned(sourceId, targetId, instruction, explicitIndex) {
		// Don't move to self
		if (sourceId === targetId) return;

		const items = unassignedTree.items.value;
		const sourceIndex = items.findIndex((item) => item.id === sourceId);

		if (sourceIndex === -1) return;

		let newIndex;

		// Use explicit index if provided (from drop zone)
		if (explicitIndex !== undefined && explicitIndex !== null) {
			newIndex = explicitIndex;
			// Adjust if moving from before target
			if (sourceIndex < newIndex) {
				newIndex--;
			}
		} else {
			const targetIndex = items.findIndex((item) => item.id === targetId);
			if (targetIndex === -1) return;

			// Calculate new index based on instruction
			newIndex =
				instruction?.type === DROP_REORDER_ABOVE
					? targetIndex
					: targetIndex + 1;

			// Adjust if moving from before target
			if (sourceIndex < newIndex) {
				newIndex--;
			}
		}

		// Move the item
		unassignedTree.moveItem(sourceId, null, newIndex);
	}

	/**
	 * Resolve drop position from instruction
	 */
	function resolveDropPosition(tree, targetId, instruction) {
		if (!targetId || !instruction) {
			return {parentId: null, index: -1};
		}

		const targetItem = tree.findItemById(targetId);
		if (!targetItem) {
			return {parentId: null, index: -1};
		}

		switch (instruction.type) {
			case DROP_REORDER_ABOVE: {
				const parent = tree.findParentById(targetId);
				const siblings = parent ? parent.children : tree.items.value;
				const targetIndex = siblings.findIndex((item) => item.id === targetId);
				return {
					parentId: parent?.id || null,
					index: targetIndex,
				};
			}
			case DROP_REORDER_BELOW: {
				const parent = tree.findParentById(targetId);
				const siblings = parent ? parent.children : tree.items.value;
				const targetIndex = siblings.findIndex((item) => item.id === targetId);
				return {
					parentId: parent?.id || null,
					index: targetIndex + 1,
				};
			}
			case DROP_MAKE_CHILD: {
				return {
					parentId: targetId,
					index: -1, // Append to children
				};
			}
			default:
				return {parentId: null, index: -1};
		}
	}

	/**
	 * Check if dropping source onto target is allowed
	 * Prevents dropping a parent onto its own descendant
	 * Also validates that the source's subtree won't exceed max depth
	 */
	function canDropOnTarget({
		sourceId,
		sourcePanel,
		targetId,
		targetPanel,
		depth = 0,
		isDropZone = false,
	}) {
		// Only check for assigned panel (has nesting)
		if (targetPanel !== PANEL_ASSIGNED) {
			return true;
		}

		// Can't drop on self
		if (sourceId === targetId) {
			return false;
		}

		// Check if target is a descendant of source (only for assigned panel)
		if (targetId && assignedTree.isDescendantOf(targetId, sourceId)) {
			return false;
		}

		// Calculate where the source item would land
		// For drop zones: item lands at the zone's depth
		// For make-child: item lands at target's depth + 1
		const newSourceDepth = isDropZone ? depth : depth + 1;

		// Get the source item's subtree depth
		// Look in the appropriate panel
		const sourceTree =
			sourcePanel === PANEL_ASSIGNED ? assignedTree : unassignedTree;
		const sourceSubtreeDepth = sourceTree.getSubtreeDepth(sourceId);

		// Check if the deepest descendant would exceed max depth
		// deepestLevel = newSourceDepth + sourceSubtreeDepth
		if (newSourceDepth + sourceSubtreeDepth > maxDepth) {
			return false;
		}

		return true;
	}

	// Computed properties for reactive access
	const assignedItems = computed(() => assignedTree.items.value);
	const unassignedItems = computed(() => unassignedTree.items.value);

	return {
		// State
		assignedItems,
		unassignedItems,

		// Actions
		handleMove,
		canDropOnTarget,
	};
}
