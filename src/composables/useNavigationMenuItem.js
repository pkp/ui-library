import {ref, onMounted, onUnmounted, watch} from 'vue';
import {
	draggable,
	dropTargetForElements,
} from '@atlaskit/pragmatic-drag-and-drop/element/adapter';

export function useNavigationMenuItem(dragEl, dropEl, listEl, props) {
	const isDragging = ref(false);
	const isDragOver = ref(false);
	const isListOver = ref(false);

	let cleanupDraggable;
	let cleanupDropTarget;
	let cleanupListDropTarget;

	onMounted(() => {
		if (dragEl.value) {
			cleanupDraggable = draggable({
				element: dragEl.value,
				getInitialData: () => ({
					id: props.item.id,
					type: 'menu-item',
					level: props.level,
					isAssigned: props.isAssigned,
				}),
				onDragStart: () => (isDragging.value = true),
				onDrop: () => (isDragging.value = false),
			});
		}

		if (dropEl.value) {
			cleanupDropTarget = dropTargetForElements({
				element: dropEl.value,
				getData: () => ({
					id: props.item.id,
					type: 'menu-item',
					level: props.level,
					isAssigned: props.isAssigned,
				}),
				onDragEnter: () => (isDragOver.value = true),
				onDragLeave: () => (isDragOver.value = false),
				onDrop: () => (isDragOver.value = false),
			});
		}
	});

	// Watch for list element changes (e.g. when children are added/removed)
	watch(
		() => listEl?.value,
		(el) => {
			if (cleanupListDropTarget) {
				cleanupListDropTarget();
				cleanupListDropTarget = null;
			}

			if (el) {
				cleanupListDropTarget = dropTargetForElements({
					element: el,
					getData: () => ({
						id: props.item.id,
						type: 'list', // Treat as a list
						isAssigned: props.isAssigned,
					}),
					onDragEnter: () => (isListOver.value = true),
					onDragLeave: () => (isListOver.value = false),
					onDrop: () => (isListOver.value = false),
				});
			}
		},
		{immediate: true},
	);

	onUnmounted(() => {
		if (cleanupDraggable) cleanupDraggable();
		if (cleanupDropTarget) cleanupDropTarget();
		if (cleanupListDropTarget) cleanupListDropTarget();
	});

	return {
		isDragging,
		isDragOver,
		isListOver,
	};
}
