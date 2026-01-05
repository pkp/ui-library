<template>
	<div class="relative">
		<!-- Item container -->
		<div
			ref="itemRef"
			class="bg-white group relative mb-2 flex cursor-grab items-center border border-light active:cursor-grabbing"
			:class="{
				'border-2 border-primary bg-primary/5':
					isOver && instruction?.type === DROP_MAKE_CHILD,
			}"
			:style="itemStyle"
		>
			<!-- Drag handle icon -->
			<div
				class="flex h-full items-center px-2 py-2 text-primary"
				:aria-label="t('common.dragToReorder')"
			>
				<Icon icon="Sort" class="h-4 w-4" />
			</div>

			<!-- Item title -->
			<span class="text-sm flex-grow truncate py-2 pe-2">
				{{ item.title }}
			</span>

			<!-- Status icons -->
			<div class="flex items-center gap-1 pe-2">
				<!-- Warning icon (shows when item has children - submenu warning) -->
				<button
					v-if="item.hasWarning"
					type="button"
					class="cursor-pointer text-negative hover:opacity-80"
					:title="item.warningMessage"
					@click.stop="onSubmenuWarningClick"
				>
					<Icon icon="Error" class="h-4 w-4" />
				</button>

				<!-- Visibility icons - different behavior for assigned vs unassigned -->
				<template v-if="panelId === PANEL_ASSIGNED">
					<!-- Assigned panel: always show slashed eye icon, clickable if has conditional warning -->
					<button
						v-if="item.conditionalWarning"
						type="button"
						class="cursor-pointer text-primary hover:opacity-80"
						:title="item.conditionalWarning"
						@click.stop="onConditionalWarningClick"
					>
						<Icon icon="NotVisible" class="h-4 w-4" />
					</button>
					<span v-else class="text-primary">
						<Icon icon="NotVisible" class="h-4 w-4" />
					</span>
				</template>
				<template v-else>
					<!-- Unassigned panel: only show crossed-out eye for conditional display items -->
					<button
						v-if="item.isVisible === false"
						type="button"
						class="cursor-pointer text-disabled hover:opacity-80"
						:title="
							item.conditionalWarning ||
							t('manager.navigationMenus.form.conditionalDisplay')
						"
						@click.stop="onConditionalWarningClick"
					>
						<Icon icon="NotVisible" class="h-4 w-4" />
					</button>
					<!-- No icon for items without conditional display -->
				</template>
			</div>
		</div>

		<!-- Recursive children with drop zones -->
		<template v-if="hasChildren && allowChildren">
			<!-- Drop zone at the beginning of children -->
			<DropZone
				:panel-id="panelId"
				:parent-id="item.id"
				:index="0"
				:before-item-id="item.children[0]?.id"
				:after-item-id="null"
				:depth="depth + 1"
				:indent-per-level="indentPerLevel"
			/>

			<template v-for="(child, childIndex) in item.children" :key="child.id">
				<MenuTreeItem
					:item="child"
					:depth="depth + 1"
					:max-depth="maxDepth"
					:panel-id="panelId"
					:allow-children="depth + 1 < maxDepth"
					:indent-per-level="indentPerLevel"
					@move="handleChildMove"
				/>

				<!-- Drop zone after each child -->
				<DropZone
					:panel-id="panelId"
					:parent-id="item.id"
					:index="childIndex + 1"
					:before-item-id="item.children[childIndex + 1]?.id || null"
					:after-item-id="child.id"
					:depth="depth + 1"
					:indent-per-level="indentPerLevel"
				/>
			</template>
		</template>
	</div>
</template>

<script setup>
import {ref, computed, onMounted, onUnmounted, inject} from 'vue';
import {useLocalize} from '@/composables/useLocalize';
import {useMenuItemWarnings} from '../composables/useMenuItemWarnings';
import {
	PANEL_ASSIGNED,
	DROP_MAKE_CHILD,
	DEFAULT_MAX_DEPTH,
	DEFAULT_INDENT_PER_LEVEL,
} from '../constants';
import Icon from '@/components/Icon/Icon.vue';
import DropZone from './DropZone.vue';

const {t} = useLocalize();
const {showSubmenuWarning, showConditionalWarning} = useMenuItemWarnings();

const props = defineProps({
	/**
	 * The menu item data
	 */
	item: {
		type: Object,
		required: true,
	},
	/**
	 * Current depth level (1-based)
	 */
	depth: {
		type: Number,
		default: 1,
	},
	/**
	 * Maximum nesting depth
	 */
	maxDepth: {
		type: Number,
		default: DEFAULT_MAX_DEPTH,
	},
	/**
	 * Panel identifier ('assigned' or 'unassigned')
	 */
	panelId: {
		type: String,
		required: true,
	},
	/**
	 * Whether this item can have children
	 */
	allowChildren: {
		type: Boolean,
		default: true,
	},
	/**
	 * Pixels per indent level
	 */
	indentPerLevel: {
		type: Number,
		default: DEFAULT_INDENT_PER_LEVEL,
	},
});

const emit = defineEmits([
	/**
	 * Emitted when move operation occurs
	 */
	'move',
]);

// Inject DND functions from parent
const setupDragSource = inject('setupDragSource');
const setupDropTarget = inject('setupDropTarget');
const combineCleanups = inject('combineCleanups');
const isDraggedOver = inject('isDraggedOver');
const getInstruction = inject('getInstruction');

// Element refs
const itemRef = ref(null);

// Cleanup function
let cleanup = null;

// Computed styles - use margin to indent the entire container box
const itemStyle = computed(() => ({
	marginInlineStart: `${(props.depth - 1) * props.indentPerLevel}px`,
}));

// Check if this item is being dragged over
const isOver = computed(() => isDraggedOver?.(props.item.id));

// Get current drop instruction for this item
const instruction = computed(() => getInstruction?.(props.item.id));

// Check if item has children
const hasChildren = computed(() => {
	return props.item.children?.length > 0;
});

// Can accept children based on depth
const canNest = computed(() => {
	return props.allowChildren && props.depth < props.maxDepth;
});

// Click handlers for warning icons
function onSubmenuWarningClick() {
	showSubmenuWarning(props.item.warningMessage);
}

function onConditionalWarningClick() {
	showConditionalWarning(props.item.conditionalWarning);
}

// Setup drag and drop
onMounted(() => {
	if (!itemRef.value) return;
	if (!setupDragSource || !setupDropTarget) return;

	const dragCleanup = setupDragSource({
		element: itemRef.value,
		// Make the whole item draggable (no separate drag handle)
		item: props.item,
		panelId: props.panelId,
	});

	const dropCleanup = setupDropTarget({
		element: itemRef.value,
		item: props.item,
		panelId: props.panelId,
		depth: props.depth,
		allowChildren: canNest.value,
	});

	cleanup = combineCleanups?.(dragCleanup, dropCleanup);
});

onUnmounted(() => {
	if (cleanup) {
		cleanup();
	}
});

// Bubble up move events from children
function handleChildMove(payload) {
	emit('move', payload);
}
</script>
