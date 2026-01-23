<template>
	<div class="relative" :data-cy="'menu-item-' + item.id">
		<!-- Item container -->
		<div
			ref="itemRef"
			class="bg-white group relative mb-2 flex cursor-grab items-center border border-light active:cursor-grabbing"
			:class="{
				'border-2 border-primary bg-primary/5':
					isOver && instruction?.type === DROP_MAKE_CHILD,
			}"
			:style="itemStyle"
			:data-menu-item-title="item.title"
		>
			<!-- Drag handle icon -->
			<div
				class="flex h-full items-center px-2 py-1"
				:class="panelId === PANEL_ASSIGNED ? 'text-primary' : 'text-default'"
				:title="t('common.dragToReorder')"
			>
				<Icon icon="Sort" class="h-4 w-4" />
			</div>

			<!-- Item title -->
			<span class="text-sm flex-grow truncate py-1 pe-2">
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

				<!-- Conditional visibility icon - only shows for items with conditional display -->
				<button
					v-if="item.conditionalWarning"
					type="button"
					class="cursor-pointer hover:opacity-80"
					:class="panelId === PANEL_ASSIGNED ? 'text-primary' : 'text-default'"
					:title="item.conditionalWarning"
					@click.stop="onConditionalWarningClick"
				>
					<Icon icon="NotVisible" class="h-4 w-4" />
				</button>
			</div>
		</div>

		<!-- Recursive children with drop zones -->
		<template v-if="hasChildren && allowChildren">
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
import {useMenuItemWarnings} from './useMenuItemWarnings';
import {PANEL_ASSIGNED, DROP_MAKE_CHILD} from './useNavigationMenuEditor';
import Icon from '@/components/Icon/Icon.vue';
import DropZone from './DropZone.vue';

const {t} = useLocalize();
const {showSubmenuWarning, showConditionalWarning} = useMenuItemWarnings();

const props = defineProps({
	item: {
		type: Object,
		required: true,
	},
	depth: {
		type: Number,
		default: 1,
	},
	maxDepth: {
		type: Number,
		default: 3,
	},
	panelId: {
		type: String,
		required: true,
	},
	allowChildren: {
		type: Boolean,
		default: true,
	},
	indentPerLevel: {
		type: Number,
		default: 24,
	},
});

const emit = defineEmits(['move']);

// Inject DND functions from parent
const setupDragSource = inject('setupDragSource');
const setupDropTarget = inject('setupDropTarget');
const combineCleanups = inject('combineCleanups');
const isDraggedOver = inject('isDraggedOver');
const getInstruction = inject('getInstruction');

const itemRef = ref(null);
let cleanup = null;

const itemStyle = computed(() => ({
	marginInlineStart: `${(props.depth - 1) * props.indentPerLevel}px`,
}));

const isOver = computed(() => isDraggedOver?.(props.item.id));
const instruction = computed(() => getInstruction?.(props.item.id));
const hasChildren = computed(() => props.item.children?.length > 0);
const canNest = computed(
	() => props.allowChildren && props.depth < props.maxDepth,
);

function onSubmenuWarningClick() {
	showSubmenuWarning(props.item.warningMessage);
}

function onConditionalWarningClick() {
	showConditionalWarning(props.item.conditionalWarning);
}

onMounted(() => {
	if (!itemRef.value || !setupDragSource || !setupDropTarget) return;

	const dragCleanup = setupDragSource({
		element: itemRef.value,
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
	if (cleanup) cleanup();
});

function handleChildMove(payload) {
	emit('move', payload);
}
</script>
