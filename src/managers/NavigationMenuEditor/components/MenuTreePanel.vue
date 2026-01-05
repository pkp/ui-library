<template>
	<div class="flex flex-col">
		<!-- Panel header -->
		<div class="border-heading border-b-2 bg-secondary px-4 py-3">
			<h3 class="text-lg-bold text-heading">{{ title }}</h3>
		</div>

		<!-- Panel content -->
		<div
			ref="panelRef"
			class="min-h-[200px] flex-grow bg-secondary px-2 pb-2 pt-3"
			:class="{
				'ring-2 ring-inset ring-primary ring-opacity-50': isPanelDraggedOver,
			}"
		>
			<!-- Items with drop zones -->
			<template v-if="items.length > 0">
				<!-- Drop zone at the beginning -->
				<DropZone
					:panel-id="panelId"
					:parent-id="null"
					:index="0"
					:before-item-id="items[0]?.id"
					:after-item-id="null"
					:depth="1"
					:indent-per-level="indentPerLevel"
				/>

				<template v-for="(item, index) in items" :key="item.id">
					<!-- Menu item -->
					<MenuTreeItem
						:item="item"
						:depth="1"
						:max-depth="maxDepth"
						:panel-id="panelId"
						:allow-children="allowNesting"
						:indent-per-level="indentPerLevel"
						@move="handleMove"
					/>

					<!-- Drop zone after each item -->
					<DropZone
						:panel-id="panelId"
						:parent-id="null"
						:index="index + 1"
						:before-item-id="items[index + 1]?.id || null"
						:after-item-id="item.id"
						:depth="1"
						:indent-per-level="indentPerLevel"
					/>
				</template>
			</template>

			<!-- Empty state -->
			<div
				v-else
				class="flex h-[180px] items-center justify-center text-disabled"
			>
				<p>{{ emptyMessage || t('common.noItemsFound') }}</p>
			</div>
		</div>
	</div>
</template>

<script setup>
import {ref, provide, onMounted, onUnmounted, computed} from 'vue';
import {useLocalize} from '@/composables/useLocalize';
import MenuTreeItem from './MenuTreeItem.vue';
import DropZone from './DropZone.vue';
import {useTreeDragDrop} from '../composables/useTreeDragDrop';
import {DEFAULT_MAX_DEPTH, DEFAULT_INDENT_PER_LEVEL} from '../constants';

const {t} = useLocalize();

const props = defineProps({
	/**
	 * Panel title
	 */
	title: {
		type: String,
		required: true,
	},
	/**
	 * Tree/list items
	 */
	items: {
		type: Array,
		required: true,
	},
	/**
	 * Whether nesting is allowed (false for unassigned panel)
	 */
	allowNesting: {
		type: Boolean,
		default: true,
	},
	/**
	 * Maximum depth (only relevant if allowNesting is true)
	 */
	maxDepth: {
		type: Number,
		default: DEFAULT_MAX_DEPTH,
	},
	/**
	 * Panel identifier for DND context
	 */
	panelId: {
		type: String,
		required: true,
	},
	/**
	 * Empty state message
	 */
	emptyMessage: {
		type: String,
		default: '',
	},
	/**
	 * Pixels per indent level
	 */
	indentPerLevel: {
		type: Number,
		default: DEFAULT_INDENT_PER_LEVEL,
	},
	/**
	 * Custom drop validation function
	 * @param {Object} params - Drop validation parameters
	 * @param {string|number} params.sourceId - Source item ID
	 * @param {string} params.sourcePanel - Source panel ID
	 * @param {string|number} params.targetId - Target item ID
	 * @param {string} params.targetPanel - Target panel ID
	 * @param {number} params.depth - Target depth
	 * @param {boolean} params.isDropZone - True if this is a drop zone
	 * @returns {boolean} True if drop is allowed
	 */
	canDrop: {
		type: Function,
		default: null,
	},
});

const emit = defineEmits([
	/**
	 * Item movement within or from this panel
	 */
	'move',
]);

// Panel container ref
const panelRef = ref(null);

// Setup drag and drop
const {
	isDragging,
	draggedOverId,
	setupDragSource,
	setupDropTarget,
	setupDropZone,
	setupPanelDropTarget,
	setupMonitor,
	combineCleanups,
	isDraggedOver,
	isDraggedOverZone,
	getInstruction,
} = useTreeDragDrop({
	onMove: (payload) => {
		emit('move', payload);
	},
	canDrop: props.canDrop ? (params) => props.canDrop(params) : null,
	maxDepth: props.maxDepth,
	indentPerLevel: props.indentPerLevel,
});

// Provide DND functions to child items
provide('setupDragSource', setupDragSource);
provide('setupDropTarget', setupDropTarget);
provide('setupDropZone', setupDropZone);
provide('combineCleanups', combineCleanups);
provide('isDraggedOver', isDraggedOver);
provide('isDraggedOverZone', isDraggedOverZone);
provide('getInstruction', getInstruction);
provide('isDragging', isDragging);

// Cleanup functions
let cleanupMonitor = null;
let cleanupPanelDrop = null;

// Handle move from child
function handleMove(payload) {
	emit('move', payload);
}

// Is panel being dragged over (empty state)
const isPanelDraggedOver = computed(() => {
	return draggedOverId.value === `panel-${props.panelId}`;
});

onMounted(() => {
	// Setup global monitor
	cleanupMonitor = setupMonitor();

	// Setup panel as drop target for empty state
	if (panelRef.value) {
		cleanupPanelDrop = setupPanelDropTarget({
			element: panelRef.value,
			panelId: props.panelId,
		});
	}
});

onUnmounted(() => {
	if (cleanupMonitor) {
		cleanupMonitor();
	}
	if (cleanupPanelDrop) {
		cleanupPanelDrop();
	}
});
</script>
