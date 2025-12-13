import {ref, watch, onMounted, onUnmounted} from 'vue';
import {
	monitorForElements,
	dropTargetForElements,
} from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import {
	findAndRemove,
	findItem,
	findParentInfo,
	enforceMaxDepth,
	isDescendant,
} from '@/utils/treeHelpers';

export function useNavigationMenuBuilder(props, emit) {
	const localAssignedItems = ref([...props.assignedItems]);
	const localUnassignedItems = ref([...props.unassignedItems]);

	const assignedListEl = ref(null);
	const unassignedListEl = ref(null);
	const isAssignedOver = ref(false);
	const isUnassignedOver = ref(false);

	watch(
		() => props.assignedItems,
		(newVal) => {
			localAssignedItems.value = [...newVal];
		},
	);

	watch(
		() => props.unassignedItems,
		(newVal) => {
			localUnassignedItems.value = [...newVal];
		},
	);

	const emitUpdate = () => {
		emit('update:assignedItems', localAssignedItems.value);
		emit('update:unassignedItems', localUnassignedItems.value);
	};

	const calculateDropLocation = ({source, location}) => {
		const target = location.current.dropTargets[0];
		if (!target) return null;

		const sourceId = source.data.id;
		const targetData = target.data;
		const mouseY = location.current.input.clientY;
		const targetElement = target.element;
		const targetRect = targetElement.getBoundingClientRect();

		// Prevent dropping on self
		if (targetData.id === sourceId) return null;

		// Prevent dropping on descendants
		const sourceItem =
			findItem(localAssignedItems.value, sourceId) ||
			findItem(localUnassignedItems.value, sourceId);

		// If target is a descendant of source, block it
		if (sourceItem && isDescendant(sourceItem, targetData.id)) return null;

		if (targetData.type === 'list') {
			// Dropped on a main list container
			let listEl = null;

			if (targetData.id === 'assigned') {
				listEl = assignedListEl;
			} else if (targetData.id === 'unassigned') {
				listEl = unassignedListEl;
			} else {
				// Nested list
				listEl = {value: target.element};
			}

			if (listEl) {
				const ul =
					listEl.value.tagName === 'UL'
						? listEl.value
						: listEl.value.querySelector('ul');

				if (ul) {
					const children = Array.from(ul.children);
					// Filter out the source element AND any placeholder divs (only keep LI elements)
					const filteredChildren = children.filter(
						(child) => child !== source.element && child.tagName === 'LI',
					);

					let insertIndex = filteredChildren.length;

					for (let i = 0; i < filteredChildren.length; i++) {
						const child = filteredChildren[i];
						const rect = child.getBoundingClientRect();
						const childCenterY = rect.top + rect.height / 2;

						if (mouseY < childCenterY) {
							insertIndex = i;
							break;
						}
					}
					return {parentId: targetData.id, index: insertIndex};
				} else {
					return {parentId: targetData.id, index: 0};
				}
			}
		} else if (targetData.type === 'menu-item') {
			const targetId = targetData.id;
			const targetLevel = targetData.level;
			const targetIsAssigned = targetData.isAssigned;

			const relativeY = (mouseY - targetRect.top) / targetRect.height;
			let action = '';

			if (targetIsAssigned && targetLevel < 3) {
				if (relativeY < 0.1) action = 'before';
				else if (relativeY > 0.9) action = 'after';
				else action = 'nest';
			} else {
				if (relativeY < 0.5) action = 'before';
				else action = 'after';
			}

			if (action === 'before') {
				let result = findParentInfo(
					localAssignedItems.value,
					targetId,
					'assigned',
				);
				if (!result) {
					result = findParentInfo(
						localUnassignedItems.value,
						targetId,
						'unassigned',
					);
				}
				if (result) {
					return {parentId: result.parentId, index: result.index};
				}
			} else if (action === 'after') {
				let result = findParentInfo(
					localAssignedItems.value,
					targetId,
					'assigned',
				);
				if (!result) {
					result = findParentInfo(
						localUnassignedItems.value,
						targetId,
						'unassigned',
					);
				}
				if (result) {
					return {parentId: result.parentId, index: result.index + 1};
				}
			} else if (action === 'nest') {
				const targetItem = findItem(localAssignedItems.value, targetId);
				if (targetItem) {
					return {
						parentId: targetId,
						index: targetItem.children ? targetItem.children.length : 0,
					};
				}
			}
		}
		return null;
	};

	let cleanupAssigned;
	let cleanupUnassigned;
	let cleanupMonitor;

	onMounted(() => {
		// Register drop targets for the main lists
		cleanupAssigned = dropTargetForElements({
			element: assignedListEl.value,
			getData: () => ({type: 'list', id: 'assigned'}),
			onDragEnter: () => (isAssignedOver.value = true),
			onDragLeave: () => (isAssignedOver.value = false),
			onDrop: () => (isAssignedOver.value = false),
		});

		cleanupUnassigned = dropTargetForElements({
			element: unassignedListEl.value,
			getData: () => ({type: 'list', id: 'unassigned'}),
			onDragEnter: () => (isUnassignedOver.value = true),
			onDragLeave: () => (isUnassignedOver.value = false),
			onDrop: () => (isUnassignedOver.value = false),
		});

		// Monitor drops globally
		cleanupMonitor = monitorForElements({
			onDrop({source, location}) {
				const dropLoc = calculateDropLocation({source, location});
				if (!dropLoc) return;

				const sourceId = source.data.id;

				// 1. Find and remove the item from its current location
				let item = findAndRemove(localAssignedItems.value, sourceId);
				if (!item) {
					item = findAndRemove(localUnassignedItems.value, sourceId);
				}

				if (!item) return;

				// 2. Add to new location
				let targetList = null;
				if (dropLoc.parentId === 'assigned') {
					targetList = localAssignedItems.value;
				} else if (dropLoc.parentId === 'unassigned') {
					targetList = localUnassignedItems.value;
				} else {
					const parentItem = findItem(
						localAssignedItems.value,
						dropLoc.parentId,
					);
					if (parentItem) {
						if (!parentItem.children) parentItem.children = [];
						targetList = parentItem.children;
					}
				}

				if (targetList) {
					targetList.splice(dropLoc.index, 0, item);
				}

				// 3. Enforce depth limits
				localAssignedItems.value = enforceMaxDepth(
					localAssignedItems.value,
					1,
					3,
				);
				localUnassignedItems.value = enforceMaxDepth(
					localUnassignedItems.value,
					1,
					1,
				);

				emitUpdate();
			},
		});
	});

	onUnmounted(() => {
		if (cleanupAssigned) cleanupAssigned();
		if (cleanupUnassigned) cleanupUnassigned();
		if (cleanupMonitor) cleanupMonitor();
	});

	return {
		localAssignedItems,
		localUnassignedItems,
		assignedListEl,
		unassignedListEl,
		isAssignedOver,
		isUnassignedOver,
	};
}
