<template>
	<div class="relative" :class="showGhost ? '' : 'h-0'">
		<div
			ref="zoneRef"
			class="absolute -top-4 right-0"
			:class="{
				'pointer-events-none': !isAnyDragging,
				'h-6': !showGhost,
				'bottom-0': showGhost,
			}"
			:style="zoneStyle"
		></div>
		<DropGhostPreview
			v-if="showGhost"
			:visible="true"
			:items="previewItems"
			:indent-per-level="indentPerLevel"
		/>
	</div>
</template>

<script setup>
import {ref, onMounted, onUnmounted, inject, computed} from 'vue';
import {computeDropPreview} from './useMenuTree';
import DropGhostPreview from './DropGhostPreview.vue';

const props = defineProps({
	beforeItemId: {
		type: [String, Number],
		default: null,
	},
	afterItemId: {
		type: [String, Number],
		default: null,
	},
	parentId: {
		type: [String, Number],
		default: null,
	},
	panelId: {
		type: String,
		required: true,
	},
	depth: {
		type: Number,
		default: 1,
	},
	index: {
		type: Number,
		required: true,
	},
	indentPerLevel: {
		type: Number,
		default: 24,
	},
});

const setupDropZone = inject('setupDropZone');
const isDragging = inject('isDragging');
const isDraggedOverZoneFn = inject('isDraggedOverZone');
const draggedItemData = inject('draggedItem', ref(null));
const panelMaxDepth = inject('panelMaxDepth', 2);

const zoneRef = ref(null);
let cleanup = null;

const isAnyDragging = computed(() => isDragging?.value ?? false);

const zoneId = computed(
	() => `zone-${props.panelId}-${props.parentId ?? 'root'}-${props.index}`,
);

const isHovered = computed(() => isDraggedOverZoneFn?.(zoneId.value));

const previewItems = computed(() => {
	if (!isHovered.value || !draggedItemData?.value) return [];
	return computeDropPreview(draggedItemData.value, props.depth, panelMaxDepth);
});

const showGhost = computed(() => previewItems.value.length > 0);

const zoneStyle = computed(() => ({
	left: `${(props.depth - 1) * props.indentPerLevel}px`,
	zIndex: 30 + props.depth * 10,
}));

onMounted(() => {
	if (!zoneRef.value || !setupDropZone) return;

	cleanup = setupDropZone({
		element: zoneRef.value,
		getZoneData: () => ({
			panelId: props.panelId,
			parentId: props.parentId,
			index: props.index,
			beforeItemId: props.beforeItemId,
			afterItemId: props.afterItemId,
			depth: props.depth,
		}),
	});
});

onUnmounted(() => {
	if (cleanup) cleanup();
});
</script>
