<template>
	<!-- Wrapper maintains position in flow but has no height -->
	<div class="relative h-0">
		<!-- Actual drop zone - absolutely positioned to overlay the gap -->
		<!-- Clickable area starts at indent, deeper zones have higher z-index -->
		<div
			ref="zoneRef"
			class="absolute -top-4 right-0 flex h-6 items-center"
			:class="{'pointer-events-none': !isAnyDragging}"
			:style="zoneStyle"
		>
			<!-- Dotted line preview when hovering -->
			<div
				v-if="isOver"
				class="pointer-events-none h-0 w-full border-t-2 border-dashed border-primary"
			></div>
		</div>
	</div>
</template>

<script setup>
import {ref, onMounted, onUnmounted, inject, computed} from 'vue';

const props = defineProps({
	/**
	 * The item ID this drop zone is positioned before
	 * Use null for the "end of list" drop zone
	 */
	beforeItemId: {
		type: [String, Number],
		default: null,
	},
	/**
	 * The item ID this drop zone is positioned after
	 * Use null for the "beginning of list" drop zone
	 */
	afterItemId: {
		type: [String, Number],
		default: null,
	},
	/**
	 * Parent item ID (null for root level)
	 */
	parentId: {
		type: [String, Number],
		default: null,
	},
	/**
	 * Panel identifier
	 */
	panelId: {
		type: String,
		required: true,
	},
	/**
	 * Current depth level
	 */
	depth: {
		type: Number,
		default: 1,
	},
	/**
	 * Index position in the list
	 */
	index: {
		type: Number,
		required: true,
	},
	/**
	 * Pixels per indent level
	 */
	indentPerLevel: {
		type: Number,
		default: 24,
	},
});

// Inject DND setup
const setupDropZone = inject('setupDropZone');
const isDraggedOverZone = inject('isDraggedOverZone');
const isDragging = inject('isDragging');

// Element ref
const zoneRef = ref(null);

// Cleanup
let cleanup = null;

// Generate current zone ID based on props
const zoneId = computed(
	() => `zone-${props.panelId}-${props.parentId ?? 'root'}-${props.index}`,
);

// Check if this zone is being dragged over
const isOver = computed(() => isDraggedOverZone?.(zoneId.value));

// Check if any drag is in progress
const isAnyDragging = computed(() => isDragging?.value ?? false);

// Computed style for zone positioning
// - left: starts at indent position so zones at different depths don't fully overlap
// - zIndex: deeper zones get higher z-index so they receive events in their visual area
const zoneStyle = computed(() => ({
	left: `${(props.depth - 1) * props.indentPerLevel}px`,
	zIndex: 30 + props.depth * 10, // depth 1 = 40, depth 2 = 50, depth 3 = 60
}));

onMounted(() => {
	if (!zoneRef.value || !setupDropZone) return;

	cleanup = setupDropZone({
		element: zoneRef.value,
		// Use getter function to always get CURRENT prop values at drop time
		// This prevents stale closure values when items reorder
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
	if (cleanup) {
		cleanup();
	}
});
</script>
