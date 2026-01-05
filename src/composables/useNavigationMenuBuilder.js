import {ref, watch, watchEffect} from 'vue';
import {
	monitorForElements,
	dropTargetForElements,
} from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import {extractInstruction} from '@atlaskit/pragmatic-drag-and-drop-hitbox/tree-item';
import {
	removeItem,
	insertItem,
	findItem,
	findParentInfo,
	enforceMaxDepth,
	isDescendant,
	flattenForForm,
} from '@/utils/treeHelpers';

export function useNavigationMenuBuilder(props, emit) {
	const localAssignedItems = ref([]);
	const localUnassignedItems = ref([]);

	const assignedListEl = ref(null);
	const unassignedListEl = ref(null);
	const isAssignedOver = ref(false);
	const isUnassignedOver = ref(false);

	watch(
		() => props.assignedItems,
		(newVal) => {
			localAssignedItems.value = JSON.parse(JSON.stringify(newVal));
		},
		{immediate: true},
	);

	watch(
		() => props.unassignedItems,
		(newVal) => {
			localUnassignedItems.value = JSON.parse(JSON.stringify(newVal));
		},
		{immediate: true},
	);

	const emitUpdate = () => {
		emit('update:assignedItems', localAssignedItems.value);
		emit('update:unassignedItems', localUnassignedItems.value);

		// Emit form ready data
		const formData = {
			...flattenForForm(localAssignedItems.value),
			...flattenForForm(localUnassignedItems.value),
		};
		emit('update:formData', formData);
	};

	watchEffect((onCleanup) => {
		if (assignedListEl.value) {
			const cleanup = dropTargetForElements({
				element: assignedListEl.value,
				getData: () => ({type: 'list', id: 'assigned'}),
				onDragEnter: () => (isAssignedOver.value = true),
				onDragLeave: () => (isAssignedOver.value = false),
				onDrop: () => (isAssignedOver.value = false),
			});
			onCleanup(cleanup);
		}
	});

	watchEffect((onCleanup) => {
		if (unassignedListEl.value) {
			const cleanup = dropTargetForElements({
				element: unassignedListEl.value,
				getData: () => ({type: 'list', id: 'unassigned'}),
				onDragEnter: () => (isUnassignedOver.value = true),
				onDragLeave: () => (isUnassignedOver.value = false),
				onDrop: () => (isUnassignedOver.value = false),
			});
			onCleanup(cleanup);
		}
	});

	watchEffect((onCleanup) => {
		const cleanup = monitorForElements({
			onDrop({source, location}) {
				const target = location.current.dropTargets[0];
				if (!target) return;

				const sourceId = source.data.id;
				const targetData = target.data;

				// Prevent dropping on self
				if (targetData.id === sourceId) return;

				// Find source item
				let sourceItem = findItem(localAssignedItems.value, sourceId);
				if (!sourceItem) {
					sourceItem = findItem(localUnassignedItems.value, sourceId);
				}
				if (!sourceItem) return;

				// Prevent dropping on descendants
				if (isDescendant(sourceItem, targetData.id)) return;

				let parentId = null;
				let index = 0;

				if (targetData.type === 'list') {
					parentId = targetData.id;
					if (parentId === 'assigned') {
						index = localAssignedItems.value.length;
					} else {
						index = localUnassignedItems.value.length;
					}
				} else if (targetData.type === 'menu-item') {
					const instruction = extractInstruction(targetData);
					if (!instruction) return;

					const targetParentInfo =
						findParentInfo(
							localAssignedItems.value,
							targetData.id,
							'assigned',
						) ||
						findParentInfo(
							localUnassignedItems.value,
							targetData.id,
							'unassigned',
						);
					if (!targetParentInfo) return;

					if (instruction.type === 'reorder-above') {
						parentId = targetParentInfo.parentId;
						index = targetParentInfo.index;
					} else if (instruction.type === 'reorder-below') {
						parentId = targetParentInfo.parentId;
						index = targetParentInfo.index + 1;
					} else if (instruction.type === 'make-child') {
						parentId = targetData.id;
						index = 0;
					} else if (instruction.type === 'reparent') {
						// Reparenting: move up a level (e.g. un-nest)
						// We need to find the parent of the current parent (grandparent of target)
						const currentParentId = targetParentInfo.parentId;
						if (
							currentParentId !== 'assigned' &&
							currentParentId !== 'unassigned'
						) {
							const grandParentInfo =
								findParentInfo(
									localAssignedItems.value,
									currentParentId,
									'assigned',
								) ||
								findParentInfo(
									localUnassignedItems.value,
									currentParentId,
									'unassigned',
								);
							if (grandParentInfo) {
								parentId = grandParentInfo.parentId;
								index = grandParentInfo.index + 1; // Insert after the parent
							}
						}
					}
				}

				// Remove from old location (immutable)
				let newAssigned = removeItem(localAssignedItems.value, sourceId);
				let newUnassigned = removeItem(localUnassignedItems.value, sourceId);

				// Insert into new location (immutable)
				// Check if parent is in assigned or unassigned
				if (parentId === 'assigned' || findItem(newAssigned, parentId)) {
					newAssigned = insertItem(
						newAssigned,
						parentId === 'assigned' ? null : parentId,
						index,
						sourceItem,
					);
				} else if (
					parentId === 'unassigned' ||
					findItem(newUnassigned, parentId)
				) {
					newUnassigned = insertItem(
						newUnassigned,
						parentId === 'unassigned' ? null : parentId,
						index,
						sourceItem,
					);
				}

				// Enforce depth limits
				localAssignedItems.value = enforceMaxDepth(newAssigned, 0, 2);
				localUnassignedItems.value = enforceMaxDepth(newUnassigned, 0, 0);

				emitUpdate();
			},
		});
		onCleanup(cleanup);
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
