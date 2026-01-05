import {ref, computed, watch} from 'vue';
import {
	dropTargetForElements,
	monitorForElements,
} from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import {
	attachClosestEdge,
	extractClosestEdge,
} from '@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge';
import {combine} from '@atlaskit/pragmatic-drag-and-drop/combine';
import cloneDeep from 'clone-deep';
import {
	removeItemById,
	insertItemAt,
	findItemById,
	flattenItem,
	flattenTreeData,
} from './useNavigationMenuTree';

/**
 * Composable for NavigationMenuEditor drag-and-drop functionality
 */
export function useNavigationMenuEditor(props, emit) {
	// Local state for items (reactive copies)
	const localAssignedItems = ref(cloneDeep(props.assignedItems));
	const localUnassignedItems = ref(cloneDeep(props.unassignedItems));

	// Watch for external changes
	watch(
		() => props.assignedItems,
		(newVal) => {
			localAssignedItems.value = cloneDeep(newVal);
		},
		{deep: true},
	);

	watch(
		() => props.unassignedItems,
		(newVal) => {
			localUnassignedItems.value = cloneDeep(newVal);
		},
		{deep: true},
	);

	// Computed for template
	const assignedItemsLocal = computed(() => localAssignedItems.value);
	const unassignedItemsLocal = computed(() => localUnassignedItems.value);

	// Drop zone states
	const isOverAssigned = ref(false);
	const isOverUnassigned = ref(false);

	// Drop indicator state
	const dropIndicator = ref({
		show: false,
		x: 0,
		y: 0,
		width: 200,
		edge: null,
	});

	const dropIndicatorStyle = computed(() => ({
		position: 'fixed',
		left: `${dropIndicator.value.x}px`,
		top: `${dropIndicator.value.y}px`,
		width: `${dropIndicator.value.width}px`,
		height: '2px',
		backgroundColor: '#006798',
		pointerEvents: 'none',
		zIndex: 9999,
		transition: 'all 0.1s ease',
	}));

	// Cleanup functions
	let cleanupFunctions = [];

	/**
	 * Handle moving an item between or within trees
	 */
	function handleMove(event) {
		const {itemId, sourceTreeId, targetTreeId, targetParentId, targetIndex} =
			event;

		const sourceItems =
			sourceTreeId === 'assigned'
				? localAssignedItems.value
				: localUnassignedItems.value;
		const targetItems =
			targetTreeId === 'assigned'
				? localAssignedItems.value
				: localUnassignedItems.value;

		// Check max depth for unassigned (must be flat)
		if (targetTreeId === 'unassigned' && targetParentId !== null) {
			return;
		}

		// Remove item from source
		const item = removeItemById(sourceItems, itemId);
		if (!item) return;

		// If moving to unassigned, flatten children
		if (targetTreeId === 'unassigned') {
			const flattened = flattenItem(item);
			flattened.forEach((flatItem, i) => {
				insertItemAt(
					targetItems,
					flatItem,
					targetIndex !== undefined ? targetIndex + i : targetItems.length,
				);
			});
		} else {
			// Moving to assigned (or within assigned)
			if (targetParentId) {
				const parent = findItemById(targetItems, targetParentId);
				if (parent) {
					if (!parent.children) parent.children = [];
					insertItemAt(
						parent.children,
						item,
						targetIndex !== undefined ? targetIndex : parent.children.length,
					);
				}
			} else {
				insertItemAt(
					targetItems,
					item,
					targetIndex !== undefined ? targetIndex : targetItems.length,
				);
			}
		}

		emitChanges();
	}

	/**
	 * Handle edit action
	 */
	function handleEdit(item) {
		emit('edit', item);
	}

	/**
	 * Emit all change events
	 */
	function emitChanges() {
		emit('update:assignedItems', cloneDeep(localAssignedItems.value));
		emit('update:unassignedItems', cloneDeep(localUnassignedItems.value));

		const menuTreeData = flattenTreeData(localAssignedItems.value);
		emit('change', {
			assignedItems: cloneDeep(localAssignedItems.value),
			unassignedItems: cloneDeep(localUnassignedItems.value),
			menuTree: menuTreeData,
		});
	}

	/**
	 * Set up drop zones for containers
	 */
	function setupDropZones(assignedDropZone, unassignedDropZone) {
		if (assignedDropZone.value) {
			const cleanup = combine(
				dropTargetForElements({
					element: assignedDropZone.value,
					getData: ({input, element}) => {
						return attachClosestEdge(
							{treeId: 'assigned', isContainer: true},
							{input, element, allowedEdges: ['top', 'bottom']},
						);
					},
					onDragEnter: () => {
						isOverAssigned.value = true;
					},
					onDragLeave: () => {
						isOverAssigned.value = false;
					},
					onDrop: () => {
						isOverAssigned.value = false;
					},
				}),
			);
			cleanupFunctions.push(cleanup);
		}

		if (unassignedDropZone.value) {
			const cleanup = combine(
				dropTargetForElements({
					element: unassignedDropZone.value,
					getData: ({input, element}) => {
						return attachClosestEdge(
							{treeId: 'unassigned', isContainer: true},
							{input, element, allowedEdges: ['top', 'bottom']},
						);
					},
					onDragEnter: () => {
						isOverUnassigned.value = true;
					},
					onDragLeave: () => {
						isOverUnassigned.value = false;
					},
					onDrop: () => {
						isOverUnassigned.value = false;
					},
				}),
			);
			cleanupFunctions.push(cleanup);
		}

		// Global monitor for drag operations
		const monitorCleanup = monitorForElements({
			onDragStart: () => {
				dropIndicator.value.show = false;
			},
			onDrag: ({location}) => {
				const target = location.current.dropTargets[0];
				if (target) {
					const edge = extractClosestEdge(target.data);
					if (edge && target.element) {
						const rect = target.element.getBoundingClientRect();
						dropIndicator.value.show = true;
						dropIndicator.value.x = rect.left;
						dropIndicator.value.width = rect.width;
						dropIndicator.value.edge = edge;
						dropIndicator.value.y = edge === 'top' ? rect.top : rect.bottom;
					}
				}
			},
			onDrop: ({source, location}) => {
				dropIndicator.value.show = false;

				// Handle drop on container (empty space)
				const target = location.current.dropTargets[0];
				if (target && target.data.isContainer) {
					handleMove({
						itemId: source.data.itemId,
						sourceTreeId: source.data.sourceTreeId,
						targetTreeId: target.data.treeId,
						targetParentId: null,
						targetIndex: undefined,
					});
				}
			},
		});
		cleanupFunctions.push(monitorCleanup);
	}

	/**
	 * Cleanup all drag-drop handlers
	 */
	function cleanup() {
		cleanupFunctions.forEach((fn) => fn());
		cleanupFunctions = [];
	}

	return {
		// State
		localAssignedItems,
		localUnassignedItems,
		assignedItemsLocal,
		unassignedItemsLocal,
		isOverAssigned,
		isOverUnassigned,
		dropIndicator,
		dropIndicatorStyle,

		// Handlers
		handleMove,
		handleEdit,
		emitChanges,
		setupDropZones,
		cleanup,
	};
}
