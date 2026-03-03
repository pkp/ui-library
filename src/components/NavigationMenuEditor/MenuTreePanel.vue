<template>
	<div class="flex flex-col" :data-cy="'panel-' + panelId">
		<!-- Panel header -->
		<div class="border-heading border-b-2 bg-secondary pb-2">
			<label class="font-bold text-default">{{ title }}</label>
		</div>

		<!-- Panel content -->
		<div
			ref="panelRef"
			class="min-h-[200px] flex-grow bg-secondary px-4 pb-16 pt-3"
			:class="{
				'ring-2 ring-inset ring-primary ring-opacity-50': isPanelDraggedOver,
				'ring-1 ring-inset ring-primary/30': isDragging && !isPanelDraggedOver,
			}"
			:data-cy="'panel-content-' + panelId"
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

				<!-- Ghost preview for panel-level drops -->
				<DropGhostPreview
					:visible="panelDropPreviewItems.length > 0"
					:items="panelDropPreviewItems"
					:indent-per-level="indentPerLevel"
				/>
			</template>

			<!-- Empty state -->
			<div
				v-else
				class="flex h-[180px] text-disabled"
				:class="
					panelDropPreviewItems.length > 0
						? 'items-start'
						: 'items-center justify-center'
				"
			>
				<DropGhostPreview
					v-if="panelDropPreviewItems.length > 0"
					:visible="true"
					:items="panelDropPreviewItems"
					:indent-per-level="indentPerLevel"
				/>
				<p v-else>{{ emptyMessage || t('common.noItemsFound') }}</p>
			</div>
		</div>
	</div>
</template>

<script setup>
import {ref, provide, onMounted, onUnmounted, computed} from 'vue';
import {useLocalize} from '@/composables/useLocalize';
import MenuTreeItem from './MenuTreeItem.vue';
import DropZone from './DropZone.vue';
import DropGhostPreview from './DropGhostPreview.vue';
import {useNavigationMenuEditorDragDrop} from './useNavigationMenuEditorDragDrop';
import {computeDropPreview} from './useMenuTree';

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
		default: 2,
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
		default: 24,
	},
	/**
	 * Custom drop validation function
	 */
	canDrop: {
		type: Function,
		default: null,
	},
});

const emit = defineEmits(['move']);

// Panel container ref
const panelRef = ref(null);

// Setup drag and drop
const {
	isDragging,
	draggedItem,
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
} = useNavigationMenuEditorDragDrop({
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
provide('draggedItem', draggedItem);
provide('panelMaxDepth', props.maxDepth);

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

// Ghost preview items for panel-level drops
const panelDropPreviewItems = computed(() => {
	if (!isPanelDraggedOver.value || !draggedItem.value) return [];
	return computeDropPreview(draggedItem.value, 1, props.maxDepth);
});

onMounted(() => {
	cleanupMonitor = setupMonitor();
	if (panelRef.value) {
		cleanupPanelDrop = setupPanelDropTarget({
			element: panelRef.value,
			panelId: props.panelId,
		});
	}
});

onUnmounted(() => {
	if (cleanupMonitor) cleanupMonitor();
	if (cleanupPanelDrop) cleanupPanelDrop();
});
</script>
