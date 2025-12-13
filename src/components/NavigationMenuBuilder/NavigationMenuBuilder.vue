<script setup>
import {ref, computed, watchEffect, watch} from 'vue';
import {
	monitorForElements,
	dropTargetForElements,
} from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import {extractInstruction} from '@atlaskit/pragmatic-drag-and-drop-hitbox/tree-item';
import NavigationMenuBuilderItem from './NavigationMenuBuilderItem.vue';
import {
	tree,
	updateTree,
	moveToUnassigned,
	moveToAssigned,
	treeToMenuTree,
} from './navigationMenuUtils.js';
import {useModal} from '@/composables/useModal.js';
import {t} from '@/utils/i18n';

// Track the currently dragged item for preview display in root drop zone
const draggedItem = ref(null);

const props = defineProps({
	/** Initial assigned menu items (tree structure) */
	assignedItems: {
		type: Array,
		default: () => [],
	},
	/** Initial unassigned menu items (flat list) */
	unassignedItems: {
		type: Array,
		default: () => [],
	},
	/** Label for assigned items panel */
	assignedLabel: {
		type: String,
		default: 'Assigned Menu Items',
	},
	/** Label for unassigned items panel */
	unassignedLabel: {
		type: String,
		default: 'Unassigned Menu Items',
	},
	/** Warning message about submenus */
	submenuWarning: {
		type: String,
		default:
			'Links with submenus may not be clicked to access content. Some themes may not display nested menu items.',
	},
	/** Indent size in pixels per nesting level */
	indentPerLevel: {
		type: Number,
		default: 24,
	},
});

const emit = defineEmits([
	/** Emitted when the menu structure changes */
	'update:assignedItems',
	/** Emitted when the unassigned items change */
	'update:unassignedItems',
	/**
	 * Emitted with the menu tree data for form submission
	 * Format: { [itemId]: { seq: number, parentId?: number } }
	 */
	'change',
]);

const {openDialog} = useModal();

// Internal state
const assigned = ref([...props.assignedItems]);
const unassigned = ref([...props.unassignedItems]);

// Refs for the drop target panels
const assignedPanelRef = ref(null);
const unassignedPanelRef = ref(null);
const unassignedContentRef = ref(null);
const rootDropZoneRef = ref(null);
const rootDropZoneActive = ref(false);
const unassignedDropZoneActive = ref(false);

// Watch for external changes
watch(
	() => props.assignedItems,
	(newVal) => {
		assigned.value = [...newVal];
	},
);

watch(
	() => props.unassignedItems,
	(newVal) => {
		unassigned.value = [...newVal];
	},
);

// Emit changes
function emitChanges() {
	emit('update:assignedItems', assigned.value);
	emit('update:unassignedItems', unassigned.value);

	// Emit the menuTree format for form submission
	const {menuTree} = treeToMenuTree(assigned.value);
	emit('change', menuTree);
}

// Flatten the assigned tree for rendering
const flattenedAssigned = computed(() => {
	const result = [];

	function flatten(items, level = 0, parentId = null) {
		items.forEach((item, index) => {
			const hasChildren = tree.hasChildren(item);
			const isLastInGroup = index === items.length - 1;

			result.push({
				item,
				level,
				hasChildren,
				isLastInGroup,
				parentId,
			});

			if (hasChildren) {
				flatten(item.children, level + 1, item.id);
			}
		});
	}

	flatten(assigned.value);
	return result;
});

// Check if root drop zone should be visible
// It should show when there are items and the last one is nested (not at root level)
const showRootDropZone = computed(() => {
	if (flattenedAssigned.value.length === 0) {
		return false;
	}
	const lastItem = flattenedAssigned.value[flattenedAssigned.value.length - 1];
	return lastItem.level > 0;
});

// Set up root drop zone
watchEffect((onCleanup) => {
	const element = rootDropZoneRef.value;
	if (!element) return;

	const cleanup = dropTargetForElements({
		element,
		getData: () => ({isRootDropZone: true}),
		canDrop: () => true,
		onDragEnter: () => {
			rootDropZoneActive.value = true;
		},
		onDragLeave: () => {
			rootDropZoneActive.value = false;
		},
		onDrop: () => {
			rootDropZoneActive.value = false;
		},
	});

	onCleanup(cleanup);
});

// Set up unassigned panel as drop zone for easy "remove from menu" action
watchEffect((onCleanup) => {
	const element = unassignedContentRef.value;
	if (!element) return;

	const cleanup = dropTargetForElements({
		element,
		getData: () => ({isUnassignedDropZone: true}),
		canDrop: ({source}) => {
			// Only allow dropping items that are currently assigned (not already unassigned)
			return !source.data.isUnassigned;
		},
		onDragEnter: () => {
			unassignedDropZoneActive.value = true;
		},
		onDragLeave: () => {
			unassignedDropZoneActive.value = false;
		},
		onDrop: () => {
			unassignedDropZoneActive.value = false;
		},
	});

	onCleanup(cleanup);
});

// Set up the global drop monitor
watchEffect((onCleanup) => {
	const cleanup = monitorForElements({
		onDragStart({source}) {
			// Track the dragged item for preview display
			draggedItem.value = {
				id: source.data.id,
				title: source.data.title,
				type: source.data.type,
				isUnassigned: source.data.isUnassigned,
			};
		},
		onDrop({location, source}) {
			// Clear the dragged item
			draggedItem.value = null;

			// No drop target
			if (!location.current.dropTargets.length) {
				return;
			}

			const sourceId = source.data.id;
			const sourceIsUnassigned = source.data.isUnassigned;

			const target = location.current.dropTargets[0];
			const targetId = target.data.id;

			// Check if dropped on root drop zone
			if (target.data.isRootDropZone) {
				if (sourceIsUnassigned) {
					// Moving from unassigned to assigned at root level
					const result = moveToAssigned(
						assigned.value,
						unassigned.value,
						sourceId,
						null,
						'after',
					);
					assigned.value = result.assigned;
					unassigned.value = result.unassigned;
				} else {
					// Moving within assigned - move to root level at end
					const item = tree.find(assigned.value, sourceId);
					if (item) {
						let result = tree.remove(assigned.value, sourceId);
						result = [...result, tree.cloneWithoutChildren(item)];
						assigned.value = result;
					}
				}
				emitChanges();
				return;
			}

			// Check if dropped on unassigned drop zone (easy remove from menu)
			if (target.data.isUnassignedDropZone && !sourceIsUnassigned) {
				const result = moveToUnassigned(
					assigned.value,
					unassigned.value,
					sourceId,
				);
				assigned.value = result.assigned;
				unassigned.value = result.unassigned;
				emitChanges();
				return;
			}

			// Check if dropped on unassigned panel (not an item)
			const droppedOnUnassignedPanel =
				unassignedPanelRef.value?.contains(target.element) && !target.data.id;

			// Handle cross-panel moves
			if (sourceIsUnassigned && !droppedOnUnassignedPanel) {
				// Moving from unassigned to assigned
				const instruction = extractInstruction(target.data);

				let position = 'after';
				if (instruction?.type === 'reorder-above') {
					position = 'before';
				} else if (instruction?.type === 'make-child') {
					position = 'child';
				}

				const result = moveToAssigned(
					assigned.value,
					unassigned.value,
					sourceId,
					targetId || null,
					position,
				);
				assigned.value = result.assigned;
				unassigned.value = result.unassigned;
				emitChanges();
				return;
			}

			if (!sourceIsUnassigned && droppedOnUnassignedPanel) {
				// Moving from assigned to unassigned (dropped on panel)
				const result = moveToUnassigned(
					assigned.value,
					unassigned.value,
					sourceId,
				);
				assigned.value = result.assigned;
				unassigned.value = result.unassigned;
				emitChanges();
				return;
			}

			// Check if target is in unassigned list
			const targetInUnassigned = unassigned.value.some(
				(item) => item.id === targetId,
			);

			if (!sourceIsUnassigned && targetInUnassigned) {
				// Moving from assigned to unassigned (dropped on unassigned item)
				const result = moveToUnassigned(
					assigned.value,
					unassigned.value,
					sourceId,
				);
				assigned.value = result.assigned;
				unassigned.value = result.unassigned;
				emitChanges();
				return;
			}

			// Handle reordering within assigned panel
			if (!sourceIsUnassigned && !targetInUnassigned) {
				const instruction = extractInstruction(target.data);

				if (instruction) {
					const result = updateTree(assigned.value, {
						type: 'instruction',
						instruction,
						itemId: sourceId,
						targetId,
					});
					if (result) {
						assigned.value = result;
						emitChanges();
					}
				}
				return;
			}

			// Handle reordering within unassigned panel
			if (sourceIsUnassigned && targetInUnassigned) {
				const sourceIndex = unassigned.value.findIndex(
					(item) => item.id === sourceId,
				);
				const targetIndex = unassigned.value.findIndex(
					(item) => item.id === targetId,
				);

				if (sourceIndex !== -1 && targetIndex !== -1) {
					const newUnassigned = [...unassigned.value];
					const [removed] = newUnassigned.splice(sourceIndex, 1);

					const instruction = extractInstruction(target.data);
					const insertIndex =
						instruction?.type === 'reorder-above'
							? targetIndex > sourceIndex
								? targetIndex - 1
								: targetIndex
							: targetIndex > sourceIndex
								? targetIndex
								: targetIndex + 1;

					newUnassigned.splice(insertIndex, 0, removed);
					unassigned.value = newUnassigned;
					emitChanges();
				}
			}
		},
	});

	onCleanup(cleanup);
});

// Show warning dialogs
function showConditionalWarning(item) {
	openDialog({
		title: t('common.notice'),
		message: item.conditionalWarning,
		actions: [
			{
				label: t('common.ok'),
				callback: (close) => close(),
			},
		],
	});
}

function showSubmenuWarning() {
	openDialog({
		title: t('common.notice'),
		message: props.submenuWarning,
		actions: [
			{
				label: t('common.ok'),
				callback: (close) => close(),
			},
		],
	});
}
</script>

<template>
	<div class="navigationMenuBuilder">
		<!-- Assigned Panel -->
		<div ref="assignedPanelRef" class="navigationMenuBuilder__panel">
			<div class="navigationMenuBuilder__panelHeader">
				{{ assignedLabel }}
			</div>
			<div class="navigationMenuBuilder__panelContent">
				<div
					v-if="flattenedAssigned.length === 0"
					class="navigationMenuBuilder__empty"
				>
					{{ t('manager.navigationMenus.empty') }}
				</div>
				<NavigationMenuBuilderItem
					v-for="{item, level, hasChildren, isLastInGroup} in flattenedAssigned"
					:key="item.id"
					:item="item"
					:level="level"
					:has-children="hasChildren"
					:is-last-in-group="isLastInGroup"
					:is-unassigned="false"
					:indent-per-level="indentPerLevel"
					@show-conditional-warning="showConditionalWarning"
					@show-submenu-warning="showSubmenuWarning"
				/>
				<!-- Root level drop zone - visible when last item is nested -->
				<div
					v-if="showRootDropZone"
					ref="rootDropZoneRef"
					class="navigationMenuBuilder__rootDropZone"
					:class="{
						'navigationMenuBuilder__rootDropZone--active': rootDropZoneActive,
					}"
				/>
			</div>
		</div>

		<!-- Unassigned Panel -->
		<div
			ref="unassignedPanelRef"
			class="navigationMenuBuilder__panel navigationMenuBuilder__panel--unassigned"
		>
			<div class="navigationMenuBuilder__panelHeader">
				{{ unassignedLabel }}
			</div>
			<div
				ref="unassignedContentRef"
				class="navigationMenuBuilder__panelContent navigationMenuBuilder__panelContent--dropZone"
				:class="{
					'navigationMenuBuilder__panelContent--dropActive':
						unassignedDropZoneActive,
				}"
			>
				<div
					v-if="unassigned.length === 0"
					class="navigationMenuBuilder__empty"
				>
					{{ t('manager.navigationMenus.unassignedEmpty') }}
				</div>
				<NavigationMenuBuilderItem
					v-for="item in unassigned"
					:key="item.id"
					:item="item"
					:level="0"
					:has-children="false"
					:is-last-in-group="false"
					:is-unassigned="true"
					:indent-per-level="indentPerLevel"
					@show-conditional-warning="showConditionalWarning"
				/>
				<!-- Drop hint when active -->
				<div
					v-if="unassignedDropZoneActive && draggedItem"
					class="navigationMenuBuilder__dropHint"
				>
					<span class="navigationMenuBuilder__dropHintText">
						Drop to remove "{{ draggedItem.title }}" from menu
					</span>
				</div>
			</div>
		</div>
	</div>
</template>

<style lang="less">
@import '../../styles/_import';

@drop-color: #2563eb; // Bright blue for drop indicators

.navigationMenuBuilder {
	display: flex;
	gap: 0;
	border: 1px solid @bg-border-color;
	border-radius: @radius;
	background: @bg;
	min-height: 300px;
}

.navigationMenuBuilder__panel {
	flex: 1;
	display: flex;
	flex-direction: column;
	min-width: 0;

	&:first-child {
		border-inline-end: 1px solid @bg-border-color;
	}
}

.navigationMenuBuilder__panel--unassigned {
	.navigationMenuBuilderItem {
		border-color: @bg-border-color-light;
		color: @text-light;
	}
}

.navigationMenuBuilder__panelHeader {
	padding: 0.75rem 1rem;
	font-weight: @bold;
	border-block-end: 1px solid @bg-border-color;
	background: @lift;
}

.navigationMenuBuilder__panelContent {
	flex: 1;
	padding: 1rem;
	min-height: 200px;
	overflow-y: auto;
}

.navigationMenuBuilder__panelContent--dropZone {
	position: relative;
	transition:
		background-color 0.15s ease,
		box-shadow 0.15s ease;
}

.navigationMenuBuilder__panelContent--dropActive {
	background: fade(@drop-color, 8%);
	box-shadow: inset 0 0 0 2px @drop-color;
}

.navigationMenuBuilder__empty {
	display: flex;
	align-items: center;
	justify-content: center;
	height: 100%;
	min-height: 150px;
	color: @text-light;
	font-style: italic;
}

.navigationMenuBuilder__rootDropZone {
	height: 20px;
	margin-block-start: -0.25rem;
}

.navigationMenuBuilder__rootDropZone--active {
	background: @drop-color;
	height: 4px;
	border-radius: 2px;
	margin-block-start: 0.25rem;
}

.navigationMenuBuilder__dropHint {
	position: absolute;
	inset: 0;
	display: flex;
	align-items: center;
	justify-content: center;
	pointer-events: none;
	z-index: 20;
}

.navigationMenuBuilder__dropHintText {
	padding: 0.5rem 1rem;
	background: @drop-color;
	color: white;
	font-weight: @bold;
	font-size: @font-sml;
	border-radius: @radius;
	box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}
</style>
