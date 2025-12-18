<template>
	<div class="flex gap-4">
		<!-- Assigned Menu Items -->
		<div class="flex-1">
			<div class="mb-2 text-lg-bold text-heading">
				{{ t('manager.navigationMenus.items.assigned') }}
			</div>
			<div
				ref="assignedContainerRef"
				class="min-h-[300px] border border-light bg-tertiary p-2"
				:class="{'ring-2 ring-primary': isAssignedDropTarget}"
			>
				<div v-if="flattenedAssignedItems.length" class="space-y-1">
					<NavigationMenuTreeItem
						v-for="flatItem in flattenedAssignedItems"
						:key="flatItem.item.id"
						:item="flatItem.item"
						:level="flatItem.level"
						source="assigned"
						@drag-start="handleDragStart"
						@drag-over="handleDragOver"
						@drop="handleDrop"
						@drag-end="clearDragState"
					/>
				</div>

				<div
					v-if="!flattenedAssignedItems.length"
					class="flex h-full min-h-[280px] items-center justify-center text-secondary"
				>
					{{ t('manager.navigationMenus.items.empty') }}
				</div>
			</div>
		</div>

		<!-- Unassigned Menu Items -->
		<div class="flex-1">
			<div class="mb-2 text-lg-bold text-heading">
				{{ t('manager.navigationMenus.items.unassigned') }}
			</div>
			<div
				ref="unassignedContainerRef"
				class="min-h-[300px] border border-light bg-tertiary p-2"
				:class="{'ring-2 ring-primary': isUnassignedDropTarget}"
			>
				<div v-if="unassignedItems.length" class="space-y-1">
					<NavigationMenuTreeItem
						v-for="item in unassignedItems"
						:key="item.id"
						:item="item"
						:level="1"
						source="unassigned"
						@drag-start="handleDragStart"
						@drag-over="handleDragOver"
						@drop="handleDrop"
						@drag-end="clearDragState"
					/>
				</div>

				<div
					v-if="!unassignedItems.length"
					class="flex h-full min-h-[280px] items-center justify-center text-secondary"
				>
					{{ t('manager.navigationMenus.items.empty') }}
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import {ref, computed, onMounted, onUnmounted, inject} from 'vue';
import {
	dropTargetForElements,
	monitorForElements,
} from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import NavigationMenuTreeItem from './NavigationMenuTreeItem.vue';

const props = defineProps({
	/**
	 * Items assigned to the navigation menu (can have up to 3 levels of nesting)
	 */
	assignedItems: {
		type: Array,
		required: true,
	},
	/**
	 * Items not assigned to any navigation menu (flat list)
	 */
	unassignedItems: {
		type: Array,
		required: true,
	},
});

const emit = defineEmits([
	'dragStart',
	'dragOver',
	'drop',
	'dropOnEmpty',
	'dragEnd',
]);

// Inject the translation function or provide a fallback
const injectedT = inject('t', null);
const t =
	injectedT ||
	((key) => {
		// Fallback translations for standalone usage
		const translations = {
			'manager.navigationMenus.items.assigned': 'Assigned Menu Items',
			'manager.navigationMenus.items.unassigned': 'Unassigned Menu Items',
			'manager.navigationMenus.items.empty': 'No items',
		};
		return translations[key] || key;
	});

const assignedContainerRef = ref(null);
const unassignedContainerRef = ref(null);
const isAssignedDropTarget = ref(false);
const isUnassignedDropTarget = ref(false);

let cleanupAssignedDropTarget = null;
let cleanupUnassignedDropTarget = null;
let cleanupMonitor = null;

/**
 * Flatten the assigned items tree into a flat array with level information
 */
const flattenedAssignedItems = computed(() => {
	const result = [];

	function flatten(items, level) {
		for (const item of items) {
			result.push({item, level});
			if (item.children?.length) {
				flatten(item.children, level + 1);
			}
		}
	}

	flatten(props.assignedItems, 1);
	return result;
});

function handleDragStart(item, source) {
	emit('dragStart', item, source);
}

function handleDragOver(targetItem, position, targetSource) {
	emit('dragOver', targetItem, position, targetSource);
}

function handleDrop(targetItem, position, targetSource) {
	emit('drop', targetItem, position, targetSource);
}

function clearDragState() {
	emit('dragEnd');
}

onMounted(() => {
	// Setup drop target for assigned container - accepts drops anywhere in container
	if (assignedContainerRef.value) {
		cleanupAssignedDropTarget = dropTargetForElements({
			element: assignedContainerRef.value,
			canDrop: () => true,
			onDragEnter: () => {
				isAssignedDropTarget.value = true;
			},
			onDragLeave: () => {
				isAssignedDropTarget.value = false;
			},
			onDrop: () => {
				isAssignedDropTarget.value = false;
				// Always emit dropOnEmpty for container drops - items will be appended to end
				emit('dropOnEmpty', 'assigned');
			},
		});
	}

	// Setup drop target for unassigned container - accepts drops anywhere in container
	if (unassignedContainerRef.value) {
		cleanupUnassignedDropTarget = dropTargetForElements({
			element: unassignedContainerRef.value,
			canDrop: () => true,
			onDragEnter: () => {
				isUnassignedDropTarget.value = true;
			},
			onDragLeave: () => {
				isUnassignedDropTarget.value = false;
			},
			onDrop: () => {
				isUnassignedDropTarget.value = false;
				// Always emit dropOnEmpty for container drops - items will be appended to end
				emit('dropOnEmpty', 'unassigned');
			},
		});
	}

	// Global monitor to clear states on drop and handle cancelled drags
	cleanupMonitor = monitorForElements({
		onDrop: () => {
			isAssignedDropTarget.value = false;
			isUnassignedDropTarget.value = false;
			// Emit dragEnd to clear the composable state if drop wasn't on a valid target
			emit('dragEnd');
		},
	});
});

onUnmounted(() => {
	cleanupAssignedDropTarget?.();
	cleanupUnassignedDropTarget?.();
	cleanupMonitor?.();
});
</script>
