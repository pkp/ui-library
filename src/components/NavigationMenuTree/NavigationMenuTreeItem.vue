<template>
	<div
		ref="itemRef"
		class="relative flex cursor-grab items-center border border-light bg-secondary px-3 py-2"
		:class="itemClasses"
		:data-item-id="item.id"
		:data-level="level"
	>
		<!-- Drag Handle Icon -->
		<div class="me-2 flex items-center text-secondary">
			<Icon icon="Sort" class="h-4 w-4" />
		</div>

		<!-- Item Content -->
		<div class="flex flex-1 items-center gap-2 overflow-hidden">
			<span class="truncate text-lg-normal">{{ item.label }}</span>

			<!-- Error Indicator -->
			<Icon
				v-if="item.hasError"
				icon="Attention"
				class="h-4 w-4 flex-shrink-0 text-attention"
			/>
		</div>

		<!-- Drop indicator line for before/after -->
		<div
			v-if="showDropIndicator"
			class="pointer-events-none absolute inset-x-0 z-10 h-1 bg-primary"
			:class="dropIndicatorClasses"
		/>

		<!-- Child drop indicator (nested) -->
		<div
			v-if="showChildDropIndicator"
			class="pointer-events-none absolute inset-x-0 bottom-0 z-10 border-2 border-dashed border-primary"
			:style="{left: `${(level + 1) * 24}px`}"
		/>
	</div>
</template>

<script setup>
import {ref, computed, onMounted, onUnmounted} from 'vue';
import {
	draggable,
	dropTargetForElements,
} from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import Icon from '@/components/Icon/Icon.vue';

const props = defineProps({
	item: {
		type: Object,
		required: true,
	},
	level: {
		type: Number,
		default: 1,
	},
	source: {
		type: String,
		required: true,
		validator: (val) => ['assigned', 'unassigned'].includes(val),
	},
});

const emit = defineEmits(['dragStart', 'dragOver', 'drop', 'dragEnd']);

const itemRef = ref(null);
const isDragging = ref(false);
const isDropTarget = ref(false);
const closestEdge = ref(null);

let cleanupDraggable = null;
let cleanupDropTarget = null;

const itemClasses = computed(() => {
	const classes = [];

	// Indentation based on level
	if (props.level === 2) {
		classes.push('ms-6');
	} else if (props.level === 3) {
		classes.push('ms-12');
	}

	// Dragging state
	if (isDragging.value) {
		classes.push('opacity-50', 'cursor-grabbing');
	}

	// Drop target state
	if (isDropTarget.value) {
		classes.push('ring-2 ring-primary');
	}

	return classes;
});

const showDropIndicator = computed(() => {
	// Use local state for more responsive feedback
	return (
		isDropTarget.value &&
		(closestEdge.value === 'before' || closestEdge.value === 'after')
	);
});

const showChildDropIndicator = computed(() => {
	return isDropTarget.value && closestEdge.value === 'child';
});

const dropIndicatorClasses = computed(() => {
	return {
		'-top-0.5': closestEdge.value === 'before',
		'-bottom-0.5': closestEdge.value === 'after',
	};
});

onMounted(() => {
	if (!itemRef.value) return;

	// Setup draggable - entire element is draggable (no dragHandle)
	cleanupDraggable = draggable({
		element: itemRef.value,
		getInitialData: () => ({
			item: props.item,
			source: props.source,
			level: props.level,
		}),
		onDragStart: () => {
			isDragging.value = true;
			emit('dragStart', props.item, props.source);
		},
		onDrop: () => {
			isDragging.value = false;
			// Don't emit dragEnd here - let the drop target handle it
			// The composable's handleDrop will call clearDragState
		},
	});

	/**
	 * Calculate drop position based on cursor location within the element
	 */
	function calculateDropPosition(clientY) {
		const rect = itemRef.value.getBoundingClientRect();
		const y = clientY - rect.top;
		const height = rect.height;

		// For unassigned items: only before/after (no nesting allowed)
		if (props.source === 'unassigned') {
			// Split in half for before/after
			return y < height / 2 ? 'before' : 'after';
		} else {
			// For assigned items: before (top 20%), child (middle 60%), after (bottom 20%)
			// But only allow 'child' if not at max depth
			if (y < height * 0.2) {
				return 'before';
			} else if (y > height * 0.8) {
				return 'after';
			} else {
				// Middle zone - allow child only if not at max depth
				return props.level < 3 ? 'child' : 'after';
			}
		}
	}

	// Setup drop target
	cleanupDropTarget = dropTargetForElements({
		element: itemRef.value,
		canDrop: ({source}) => {
			// Can't drop on self
			if (source.data.item?.id === props.item.id) {
				return false;
			}
			return true;
		},
		getData: ({input}) => {
			const position = calculateDropPosition(input.clientY);
			return {
				targetItem: props.item,
				targetSource: props.source,
				position,
				level: props.level,
			};
		},
		onDragEnter: ({location}) => {
			isDropTarget.value = true;
			const position = calculateDropPosition(location.current.input.clientY);
			closestEdge.value = position;
			emit('dragOver', props.item, position, props.source);
		},
		onDrag: ({location}) => {
			const position = calculateDropPosition(location.current.input.clientY);
			if (closestEdge.value !== position) {
				closestEdge.value = position;
				emit('dragOver', props.item, position, props.source);
			}
		},
		onDragLeave: () => {
			isDropTarget.value = false;
			closestEdge.value = null;
		},
		onDrop: ({location}) => {
			isDropTarget.value = false;
			const position = calculateDropPosition(location.current.input.clientY);
			closestEdge.value = null;
			emit('drop', props.item, position, props.source);
		},
	});
});

onUnmounted(() => {
	cleanupDraggable?.();
	cleanupDropTarget?.();
});
</script>
