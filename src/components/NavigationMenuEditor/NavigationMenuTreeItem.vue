<template>
	<div
		ref="itemElement"
		class="nav-menu-item relative"
		:class="itemClasses"
		:data-item-id="item.id"
		:data-tree-id="treeId"
		:data-level="level"
	>
		<!-- Item content row (this is the draggable and drop target) -->
		<div
			ref="rowElement"
			class="nav-menu-item__row bg-lift hover:shadow-sm relative mb-2 flex cursor-grab items-center gap-2 rounded border border-light px-3 py-2 transition-all hover:border-primary active:cursor-grabbing"
		>
			<!-- Drag handle indicator -->
			<div class="flex h-6 w-6 flex-shrink-0 items-center justify-center">
				<Icon icon="Sort" class="h-4 w-4 text-secondary" />
			</div>

			<!-- Expand/collapse toggle for items with children -->
			<button
				v-if="hasChildren"
				class="flex h-6 w-6 flex-shrink-0 cursor-pointer items-center justify-center border-none bg-transparent p-0 text-secondary hover:text-primary"
				:aria-expanded="isExpanded"
				:aria-label="isExpanded ? 'Collapse' : 'Expand'"
				@click.stop="toggleExpanded"
			>
				<Icon :icon="isExpanded ? 'ChevronDown' : 'ChevronRight'" />
			</button>
			<span v-else class="h-6 w-6 flex-shrink-0" />

			<!-- Item title -->
			<span
				class="text-sm min-w-0 flex-1 truncate"
				:class="hasConditionalWarning ? 'text-negative' : 'text-default'"
			>
				{{ item.title }}
			</span>

			<!-- Actions -->
			<div class="flex flex-shrink-0 items-center gap-1">
				<!-- Submenu warning (for items with children) -->
				<button
					v-if="hasChildren && level === 1"
					class="flex h-7 w-7 cursor-pointer items-center justify-center rounded border border-transparent bg-transparent p-0 text-negative transition-all hover:border-light hover:bg-secondary"
					:title="t('manager.navigationMenus.submenuWarning')"
					@click.stop="showSubmenuWarning"
				>
					<Icon icon="Attention" class="h-4 w-4" />
				</button>

				<!-- Conditional display warning -->
				<button
					v-if="hasConditionalWarning"
					class="flex h-7 w-7 cursor-pointer items-center justify-center rounded border border-transparent bg-transparent p-0 text-negative transition-all hover:border-light hover:bg-secondary"
					:title="conditionalWarningMessage"
					@click.stop="showConditionalWarning"
				>
					<Icon icon="Attention" class="h-4 w-4" />
				</button>
			</div>

			<!-- Drop indicator lines (inside the row for correct positioning) -->
			<div
				v-if="dropState.isDraggedOver && dropState.dropPosition === 'before'"
				class="pointer-events-none absolute inset-x-0 top-0 z-10 h-0.5 bg-primary"
			/>
			<div
				v-if="dropState.isDraggedOver && dropState.dropPosition === 'after'"
				class="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-0.5 bg-primary"
			/>
		</div>

		<!-- Children (nested items) -->
		<div v-if="hasChildren && isExpanded">
			<NavigationMenuTreeItem
				v-for="(child, childIndex) in item.children"
				:key="getItemKey(child)"
				:item="child"
				:level="level + 1"
				:max-depth="maxDepth"
				:index="childIndex"
				:tree-id="treeId"
				:parent-id="item.id"
				:sibling-count="item.children.length"
				:conditional-warnings="conditionalWarnings"
				@move="(event) => emit('move', event)"
				@edit="(event) => emit('edit', event)"
			/>
		</div>
	</div>
</template>

<script setup>
import {ref, computed, onMounted, onUnmounted, watch} from 'vue';
import {
	draggable,
	dropTargetForElements,
} from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import {combine} from '@atlaskit/pragmatic-drag-and-drop/combine';
import {setCustomNativeDragPreview} from '@atlaskit/pragmatic-drag-and-drop/element/set-custom-native-drag-preview';
import {pointerOutsideOfPreview} from '@atlaskit/pragmatic-drag-and-drop/element/pointer-outside-of-preview';
import Icon from '@/components/Icon/Icon.vue';
import {getItemKey} from '@/composables/useNavigationMenuTree';
import {useLocalize} from '@/composables/useLocalize';

const {t} = useLocalize();

const props = defineProps({
	/** Menu item data */
	item: {
		type: Object,
		required: true,
	},
	/** Current nesting level (1-based) */
	level: {
		type: Number,
		required: true,
	},
	/** Max nesting depth */
	maxDepth: {
		type: Number,
		default: 3,
	},
	/** Index among siblings */
	index: {
		type: Number,
		required: true,
	},
	/** Tree ID ('assigned' or 'unassigned') */
	treeId: {
		type: String,
		required: true,
	},
	/** Parent item ID (null for root) */
	parentId: {
		type: [Number, String, null],
		default: null,
	},
	/** Number of siblings */
	siblingCount: {
		type: Number,
		default: 1,
	},
	/** Warning messages by item type */
	conditionalWarnings: {
		type: Object,
		default: () => ({}),
	},
});

const emit = defineEmits(['move', 'edit']);

// Element refs
const itemElement = ref(null);
const rowElement = ref(null);

// State
const isExpanded = ref(true);
const isDragging = ref(false);
const dropState = ref({
	isDraggedOver: false,
	dropPosition: null, // 'before', 'inside', 'after'
});

// Computed properties
const hasChildren = computed(() => props.item.children?.length > 0);

const canAcceptNested = computed(() => {
	return props.treeId === 'assigned' && props.level < props.maxDepth;
});

const hasConditionalWarning = computed(() => {
	return (
		props.item.type &&
		props.conditionalWarnings[props.item.type] !== undefined &&
		props.conditionalWarnings[props.item.type] !== null
	);
});

const conditionalWarningMessage = computed(() => {
	return hasConditionalWarning.value
		? props.conditionalWarnings[props.item.type]
		: '';
});

const itemClasses = computed(() => ({
	'nav-menu-item--level-1': props.level === 1,
	'nav-menu-item--level-2': props.level === 2,
	'nav-menu-item--level-3': props.level >= 3,
	'nav-menu-item--dragging': isDragging.value,
	'nav-menu-item--drag-over': dropState.value.isDraggedOver,
	'nav-menu-item--drop-inside': dropState.value.dropPosition === 'inside',
	'nav-menu-item--has-children': hasChildren.value,
	'nav-menu-item--expanded': isExpanded.value && hasChildren.value,
}));

// Cleanup reference
let cleanupDraggable = null;

function toggleExpanded() {
	isExpanded.value = !isExpanded.value;
}

function showConditionalWarning() {
	alert(conditionalWarningMessage.value);
}

function showSubmenuWarning() {
	alert(t('manager.navigationMenus.submenuWarningMessage'));
}

/** Calculate drop position based on cursor location */
function getDropPosition(input, element, currentPosition = null) {
	const rect = element.getBoundingClientRect();
	const y = input.clientY;
	const height = rect.height;
	const relativeY = y - rect.top;

	// Define zones with hysteresis
	// Normal thresholds: top 25%, middle 50%, bottom 25%
	// With hysteresis: add buffer to prevent flickering at boundaries

	let topThreshold = height * 0.25;
	let bottomThreshold = height * 0.75;

	// Apply hysteresis - make it harder to leave current zone
	if (currentPosition === 'before') {
		topThreshold = height * 0.33; // Need to go further to leave 'before'
	} else if (currentPosition === 'after') {
		bottomThreshold = height * 0.67; // Need to go further to leave 'after'
	} else if (currentPosition === 'inside') {
		topThreshold = height * 0.17; // Need to go further to leave 'inside'
		bottomThreshold = height * 0.83;
	}

	if (relativeY < topThreshold) {
		return 'before';
	} else if (relativeY > bottomThreshold) {
		return 'after';
	} else {
		// Only allow 'inside' if nesting is allowed
		return canAcceptNested.value
			? 'inside'
			: relativeY < height / 2
				? 'before'
				: 'after';
	}
}

/** Setup drag and drop for this item */
function setupDragAndDrop() {
	if (!itemElement.value || !rowElement.value) return;

	cleanupDraggable = combine(
		// Make the row draggable (not the entire item with children)
		draggable({
			element: rowElement.value,
			getInitialData: () => ({
				itemId: props.item.id,
				item: props.item,
				sourceTreeId: props.treeId,
				sourceParentId: props.parentId,
				sourceIndex: props.index,
				level: props.level,
				hasChildren: hasChildren.value,
			}),
			onGenerateDragPreview: ({nativeSetDragImage}) => {
				setCustomNativeDragPreview({
					nativeSetDragImage,
					getOffset: pointerOutsideOfPreview({
						x: '16px',
						y: '8px',
					}),
					render: ({container}) => {
						// Create a simple drag preview
						const preview = document.createElement('div');
						preview.className = 'nav-menu-item__drag-preview';
						preview.textContent = props.item.title;
						container.appendChild(preview);
						return () => {
							container.removeChild(preview);
						};
					},
				});
			},
			onDragStart: () => {
				isDragging.value = true;
			},
			onDrop: () => {
				isDragging.value = false;
			},
		}),

		// Make the row a drop target (not the entire item with children)
		dropTargetForElements({
			element: rowElement.value,
			canDrop: ({source}) => {
				// Don't allow dropping on itself
				if (source.data.itemId === props.item.id) {
					return false;
				}
				return true;
			},
			getData: ({input}) => {
				const position = getDropPosition(input, rowElement.value);
				return {
					itemId: props.item.id,
					treeId: props.treeId,
					parentId: props.parentId,
					index: props.index,
					level: props.level,
					canNest: canAcceptNested.value,
					dropPosition: position,
				};
			},
			onDragEnter: ({self}) => {
				dropState.value = {
					isDraggedOver: true,
					dropPosition: self.data.dropPosition,
				};
			},
			onDrag: ({self, source, location}) => {
				// Recalculate position based on current cursor, with hysteresis
				const currentPosition = dropState.value.dropPosition;
				const position = getDropPosition(
					location.current.input,
					rowElement.value,
					currentPosition,
				);
				// Only update if position actually changed
				if (position !== currentPosition) {
					dropState.value = {
						isDraggedOver: true,
						dropPosition: position,
					};
				}
			},
			onDragLeave: () => {
				dropState.value = {
					isDraggedOver: false,
					dropPosition: null,
				};
			},
			onDrop: ({source, self, location}) => {
				const sourceData = source.data;
				const position = getDropPosition(
					location.current.input,
					rowElement.value,
				);

				let targetParentId = props.parentId;
				let targetIndex = props.index;

				if (position === 'before') {
					// Insert before this item (same parent, same index)
					targetIndex = props.index;
				} else if (position === 'after') {
					// Insert after this item (same parent, index + 1)
					targetIndex = props.index + 1;
				} else if (position === 'inside') {
					// Insert as child of this item
					targetParentId = props.item.id;
					targetIndex = props.item.children?.length || 0;
				}

				emit('move', {
					itemId: sourceData.itemId,
					sourceTreeId: sourceData.sourceTreeId,
					targetTreeId: props.treeId,
					targetParentId,
					targetIndex,
					dropPosition: position,
				});

				dropState.value = {
					isDraggedOver: false,
					dropPosition: null,
				};
			},
		}),
	);
}

onMounted(() => {
	setupDragAndDrop();
});

onUnmounted(() => {
	if (cleanupDraggable) {
		cleanupDraggable();
	}
});

// Re-setup when item changes
watch(
	() => props.item.id,
	() => {
		if (cleanupDraggable) {
			cleanupDraggable();
		}
		setupDragAndDrop();
	},
);
</script>

<style lang="less">
@import '../../styles/_import';

// Minimal custom styles - indentation and left border for nested items
.nav-menu-item {
	// Nested items - indented with left border indicator
	&--level-2 {
		margin-left: 1.5rem;

		> .nav-menu-item__row {
			border-left: 3px solid @bg-border-color-light;
		}
	}

	&--level-3 {
		margin-left: 3rem;

		> .nav-menu-item__row {
			border-left: 3px solid @bg-border-color-light;
		}
	}

	&--dragging {
		opacity: 0.5;
	}
}

// Drag preview styles (injected into body)
.nav-menu-item__drag-preview {
	padding: 0.5rem 1rem;
	background-color: @lift;
	border: 1px solid @primary;
	border-radius: 4px;
	box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
	font-size: 0.875rem;
	color: @text;
	max-width: 200px;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}
</style>
