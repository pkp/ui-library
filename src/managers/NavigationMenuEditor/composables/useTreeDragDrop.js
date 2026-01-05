import {ref} from 'vue';
import {combine} from '@atlaskit/pragmatic-drag-and-drop/combine';
import {
	draggable,
	dropTargetForElements,
	monitorForElements,
} from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import {
	attachInstruction,
	extractInstruction,
} from '@atlaskit/pragmatic-drag-and-drop-hitbox/tree-item';

/**
 * Composable for setting up tree drag and drop with Pragmatic DND
 * @param {Object} options - Configuration options
 * @param {Function} options.onMove - Callback when item is moved
 * @param {Function} options.canDrop - Optional validation function
 * @param {number} options.maxDepth - Maximum nesting depth
 * @param {number} options.indentPerLevel - Pixels per indent level
 * @returns {Object} DND API
 */
export function useTreeDragDrop(options = {}) {
	const {onMove, canDrop, maxDepth = 3, indentPerLevel = 24} = options;

	const isDragging = ref(false);
	const draggedItem = ref(null);
	const draggedOverId = ref(null);
	const draggedOverZoneId = ref(null);
	const currentInstruction = ref(null);
	// Track when a drop was blocked due to max depth
	// Used to prevent panel from accepting fallback drops
	const dropBlockedByMaxDepth = ref(false);
	// Track when a DropZone has handled the drop
	// Used to prevent panel from overriding DropZone drops
	const dropHandledByZone = ref(false);

	/**
	 * Setup drag source for an element
	 * @param {Object} params - Setup parameters
	 * @param {HTMLElement} params.element - Element to make draggable
	 * @param {HTMLElement} params.dragHandle - Optional drag handle element
	 * @param {Object} params.item - Item data
	 * @param {string} params.panelId - Panel identifier
	 * @returns {Function} Cleanup function
	 */
	function setupDragSource({element, dragHandle, item, panelId}) {
		return draggable({
			element,
			dragHandle: dragHandle || element,
			getInitialData: () => ({
				id: item.id,
				type: 'menu-item',
				panelId,
				item: {...item},
			}),
			onDragStart: () => {
				isDragging.value = true;
				draggedItem.value = item;
			},
			onDrop: () => {
				isDragging.value = false;
				draggedItem.value = null;
			},
		});
	}

	/**
	 * Setup drop target for an element
	 * @param {Object} params - Setup parameters
	 * @param {HTMLElement} params.element - Element to make a drop target
	 * @param {Object} params.item - Item data for this drop target
	 * @param {string} params.panelId - Panel identifier
	 * @param {number} params.depth - Current depth level
	 * @param {boolean} params.allowChildren - Whether nesting is allowed
	 * @returns {Function} Cleanup function
	 */
	function setupDropTarget({
		element,
		item,
		panelId,
		depth,
		allowChildren = true,
	}) {
		return dropTargetForElements({
			element,
			getData: ({input, element: el}) => {
				// Determine which drop operations to block
				const block = [];

				// Block nesting if at max depth or nesting not allowed
				if (depth >= maxDepth || !allowChildren) {
					block.push('make-child');
				}

				return attachInstruction(
					{
						id: item.id,
						panelId,
					},
					{
						input,
						element: el,
						currentLevel: depth,
						indentPerLevel,
						mode: allowChildren ? 'expanded' : 'standard',
						block,
					},
				);
			},
			canDrop: ({source}) => {
				// Prevent dropping on itself
				if (source.data.id === item.id) {
					return false;
				}

				// Prevent drops on items at max depth entirely
				// This avoids confusing fallback behavior when make-child is blocked
				// Users can use DropZone components between items for reordering at max depth
				if (depth >= maxDepth) {
					dropBlockedByMaxDepth.value = true;
					return false;
				}

				// Custom validation
				if (canDrop) {
					return canDrop({
						sourceId: source.data.id,
						sourcePanel: source.data.panelId,
						targetId: item.id,
						targetPanel: panelId,
						depth,
					});
				}

				return true;
			},
			onDragEnter: ({self}) => {
				draggedOverId.value = item.id;
				currentInstruction.value = extractInstruction(self.data);
			},
			onDrag: ({self}) => {
				// Update instruction as cursor moves within the element
				const instruction = extractInstruction(self.data);
				if (instruction?.type !== currentInstruction.value?.type) {
					currentInstruction.value = instruction;
				}
			},
			onDragLeave: () => {
				if (draggedOverId.value === item.id) {
					draggedOverId.value = null;
					currentInstruction.value = null;
					// Reset the max depth block flag when leaving the item
					// This allows drops on other targets after leaving a max-depth item
					dropBlockedByMaxDepth.value = false;
				}
			},
			onDrop: ({source, self}) => {
				const instruction = extractInstruction(self.data);
				draggedOverId.value = null;
				currentInstruction.value = null;

				if (instruction && onMove) {
					onMove({
						sourceId: source.data.id,
						sourcePanelId: source.data.panelId,
						targetId: item.id,
						targetPanelId: panelId,
						instruction,
					});
				}
			},
		});
	}

	/**
	 * Setup drop zone for between-item drops
	 * @param {Object} params - Setup parameters
	 * @param {HTMLElement} params.element - Drop zone element
	 * @param {Function} params.getZoneData - Function that returns current zone data
	 * @returns {Function} Cleanup function
	 */
	function setupDropZone({element, getZoneData}) {
		return dropTargetForElements({
			element,
			getData: () => {
				const data = getZoneData();
				return {
					type: 'drop-zone',
					zoneId: `zone-${data.panelId}-${data.parentId ?? 'root'}-${data.index}`,
					...data,
				};
			},
			canDrop: ({source}) => {
				// Only accept menu items
				if (source.data.type !== 'menu-item') return false;

				// Custom validation (e.g., prevent dropping parent into descendant, subtree depth)
				const data = getZoneData();
				if (canDrop) {
					const isAllowed = canDrop({
						sourceId: source.data.id,
						sourcePanel: source.data.panelId,
						targetId: data.parentId,
						targetPanel: data.panelId,
						depth: data.depth,
						isDropZone: true,
					});
					if (!isAllowed) {
						return false;
					}
				}

				return true;
			},
			onDragEnter: () => {
				const data = getZoneData();
				draggedOverZoneId.value = `zone-${data.panelId}-${data.parentId ?? 'root'}-${data.index}`;
			},
			onDragLeave: () => {
				const data = getZoneData();
				const zoneId = `zone-${data.panelId}-${data.parentId ?? 'root'}-${data.index}`;
				if (draggedOverZoneId.value === zoneId) {
					draggedOverZoneId.value = null;
				}
			},
			onDrop: ({source}) => {
				dropHandledByZone.value = true;
				draggedOverZoneId.value = null;

				const data = getZoneData();

				if (onMove) {
					onMove({
						sourceId: source.data.id,
						sourcePanelId: source.data.panelId,
						targetId: data.beforeItemId,
						targetPanelId: data.panelId,
						instruction: {type: 'reorder-above'},
						parentId: data.parentId,
						index: data.index,
					});
				}
			},
		});
	}

	/**
	 * Setup drop target for an empty panel or panel root
	 * @param {Object} params - Setup parameters
	 * @param {HTMLElement} params.element - Panel element
	 * @param {string} params.panelId - Panel identifier
	 * @returns {Function} Cleanup function
	 */
	function setupPanelDropTarget({element, panelId}) {
		return dropTargetForElements({
			element,
			getData: () => ({
				id: `panel-${panelId}`,
				panelId,
				isPanel: true,
			}),
			canDrop: ({source}) => {
				// Only accept menu items
				if (source.data.type !== 'menu-item') {
					return false;
				}

				// Don't accept drops if a child item blocked due to max depth
				// This prevents fallback behavior when trying to nest inside a max-depth item
				if (dropBlockedByMaxDepth.value) {
					return false;
				}

				// Don't accept drops if user is hovering over a DropZone
				// The DropZone should handle the drop instead
				if (draggedOverZoneId.value) {
					return false;
				}

				// Don't accept drops if user is hovering over a child item
				// This prevents fallback behavior when a child item rejects the drop
				if (
					draggedOverId.value &&
					!String(draggedOverId.value).startsWith('panel-')
				) {
					return false;
				}

				return true;
			},
			onDragEnter: () => {
				draggedOverId.value = `panel-${panelId}`;
			},
			onDragLeave: () => {
				if (draggedOverId.value === `panel-${panelId}`) {
					draggedOverId.value = null;
				}
			},
			onDrop: ({source}) => {
				draggedOverId.value = null;
				currentInstruction.value = null;

				// Skip if a DropZone already handled this drop
				// This prevents the panel from overriding DropZone drops
				if (dropHandledByZone.value) {
					return;
				}

				if (onMove) {
					onMove({
						sourceId: source.data.id,
						sourcePanelId: source.data.panelId,
						targetId: null, // Drop at root level
						targetPanelId: panelId,
						instruction: {type: 'reorder-below'}, // Append to end
					});
				}
			},
		});
	}

	/**
	 * Setup global monitor for drag events
	 * @returns {Function} Cleanup function
	 */
	function setupMonitor() {
		return monitorForElements({
			onDragStart: () => {
				isDragging.value = true;
				dropBlockedByMaxDepth.value = false;
			},
			onDrop: () => {
				isDragging.value = false;
				draggedItem.value = null;
				draggedOverId.value = null;
				draggedOverZoneId.value = null;
				currentInstruction.value = null;
				dropBlockedByMaxDepth.value = false;
				dropHandledByZone.value = false;
			},
		});
	}

	/**
	 * Combine multiple cleanup functions
	 * @param  {...Function} cleanups - Cleanup functions to combine
	 * @returns {Function} Combined cleanup function
	 */
	function combineCleanups(...cleanups) {
		return combine(...cleanups);
	}

	/**
	 * Check if an item is currently being dragged over
	 * @param {string|number} itemId - Item ID to check
	 * @returns {boolean} True if item is dragged over
	 */
	function isDraggedOver(itemId) {
		return draggedOverId.value === itemId;
	}

	/**
	 * Get the current drop instruction for an item
	 * @param {string|number} itemId - Item ID to check
	 * @returns {Object|null} Current instruction or null
	 */
	function getInstruction(itemId) {
		if (draggedOverId.value === itemId) {
			return currentInstruction.value;
		}
		return null;
	}

	/**
	 * Check if a drop zone is currently being dragged over
	 * @param {string} zoneId - Zone ID to check
	 * @returns {boolean} True if zone is dragged over
	 */
	function isDraggedOverZone(zoneId) {
		return draggedOverZoneId.value === zoneId;
	}

	return {
		// State
		isDragging,
		draggedItem,
		draggedOverId,
		draggedOverZoneId,
		currentInstruction,

		// Setup functions
		setupDragSource,
		setupDropTarget,
		setupDropZone,
		setupPanelDropTarget,
		setupMonitor,
		combineCleanups,

		// Helpers
		isDraggedOver,
		isDraggedOverZone,
		getInstruction,
	};
}
