import {ref, watchEffect} from 'vue';
import {
	draggable,
	dropTargetForElements,
} from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import {attachInstruction} from '@atlaskit/pragmatic-drag-and-drop-hitbox/tree-item';

export function useNavigationMenuItem(dragEl, dropEl, listEl, props) {
	const isDragging = ref(false);
	const instruction = ref(null);

	watchEffect((onCleanup) => {
		if (!dragEl.value) return;
		const cleanup = draggable({
			element: dragEl.value,
			getInitialData: () => ({
				id: props.item.id,
				type: 'menu-item',
				level: props.level,
				isAssigned: props.isAssigned,
				isOpen: true,
			}),
			onDragStart: () => (isDragging.value = true),
			onDrop: () => (isDragging.value = false),
		});
		onCleanup(cleanup);
	});

	watchEffect((onCleanup) => {
		if (!dropEl.value) return;
		const cleanup = dropTargetForElements({
			element: dropEl.value,
			getData: ({input, element}) => {
				const data = {
					id: props.item.id,
					type: 'menu-item',
					level: props.level,
					isAssigned: props.isAssigned,
					isOpen: true,
				};
				return attachInstruction(data, {
					input,
					element,
					indentPerLevel: 32, // Matches pl-8 (32px)
					currentLevel: props.level,
					mode: 'standard',
					block: [],
				});
			},
			onDragEnter: ({self}) => {
				if (self.data.instruction) {
					instruction.value = self.data.instruction;
				}
			},
			onDragLeave: () => {
				instruction.value = null;
			},
			onDrop: () => {
				instruction.value = null;
			},
			onDragUpdate: ({self}) => {
				if (self.data.instruction) {
					instruction.value = self.data.instruction;
				}
			},
		});
		onCleanup(cleanup);
	});

	return {
		isDragging,
		instruction,
	};
}
