<template>
	<div class="relative h-0">
		<div
			ref="zoneRef"
			class="absolute -top-4 right-0 flex h-6 items-center"
			:class="{'pointer-events-none': !isAnyDragging}"
			:style="zoneStyle"
		>
			<div
				v-if="isOver"
				class="pointer-events-none h-0.5 w-full rounded bg-primary"
			></div>
		</div>
	</div>
</template>

<script setup>
import {ref, onMounted, onUnmounted, inject, computed} from 'vue';

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
const isDraggedOverZone = inject('isDraggedOverZone');
const isDragging = inject('isDragging');

const zoneRef = ref(null);
let cleanup = null;

const zoneId = computed(
	() => `zone-${props.panelId}-${props.parentId ?? 'root'}-${props.index}`,
);

const isOver = computed(() => isDraggedOverZone?.(zoneId.value));
const isAnyDragging = computed(() => isDragging?.value ?? false);

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
