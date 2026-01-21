<template>
	<div class="flex flex-col gap-4">
		<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
			<!-- Assigned Menu Items (supports up to 3 levels) -->
			<div class="flex min-h-[300px] flex-col">
				<div
					class="rounded-t border border-b-0 border-light bg-secondary px-4 py-3"
				>
					<h3 class="text-lg-bold text-heading">
						{{ assignedLabel || t('manager.navigationMenus.assignedItems') }}
					</h3>
				</div>
				<div
					ref="assignedDropZone"
					class="nav-menu-editor__container flex-1 overflow-y-auto rounded-b border border-light bg-secondary p-3 pb-12 transition-colors"
					:class="{
						'nav-menu-editor__container--drag-over': isOverAssigned,
						'flex items-center justify-center !pb-3':
							!assignedItemsLocal.length,
					}"
				>
					<p
						v-if="!assignedItemsLocal.length"
						class="p-4 text-center italic text-secondary"
					>
						{{ t('manager.navigationMenus.noItemsAssigned') }}
					</p>
					<NavigationMenuTreeItem
						v-for="(item, index) in assignedItemsLocal"
						:key="getItemKey(item)"
						:item="item"
						:level="1"
						:max-depth="maxAssignedDepth"
						:index="index"
						:tree-id="'assigned'"
						:conditional-warnings="conditionalWarnings"
						@move="handleMove"
						@edit="handleEdit"
					/>
				</div>
			</div>

			<!-- Unassigned Menu Items (flat list, 1 level only) -->
			<div class="flex min-h-[300px] flex-col">
				<div
					class="rounded-t border border-b-0 border-light bg-secondary px-4 py-3"
				>
					<h3 class="text-lg-bold text-heading">
						{{
							unassignedLabel || t('manager.navigationMenus.unassignedItems')
						}}
					</h3>
				</div>
				<div
					ref="unassignedDropZone"
					class="nav-menu-editor__container flex-1 overflow-y-auto rounded-b border border-light bg-secondary p-3 pb-12 transition-colors"
					:class="{
						'nav-menu-editor__container--drag-over': isOverUnassigned,
						'flex items-center justify-center !pb-3':
							!unassignedItemsLocal.length,
					}"
				>
					<p
						v-if="!unassignedItemsLocal.length"
						class="p-4 text-center italic text-secondary"
					>
						{{ t('manager.navigationMenus.allItemsAssigned') }}
					</p>
					<NavigationMenuTreeItem
						v-for="(item, index) in unassignedItemsLocal"
						:key="getItemKey(item)"
						:item="item"
						:level="1"
						:max-depth="1"
						:index="index"
						:tree-id="'unassigned'"
						:conditional-warnings="conditionalWarnings"
						@move="handleMove"
						@edit="handleEdit"
					/>
				</div>
			</div>
		</div>

		<!-- Drop indicator preview -->
		<div
			v-if="dropIndicator.show"
			class="pointer-events-none"
			:style="dropIndicatorStyle"
		/>
	</div>
</template>

<script setup>
import {ref, onMounted, onUnmounted} from 'vue';
import NavigationMenuTreeItem from './NavigationMenuTreeItem.vue';
import {getItemKey} from '@/composables/useNavigationMenuTree';
import {useNavigationMenuEditor} from '@/composables/useNavigationMenuEditor';
import {useLocalize} from '@/composables/useLocalize';

const {t} = useLocalize();

const props = defineProps({
	/** Assigned menu items (hierarchical) */
	assignedItems: {
		type: Array,
		default: () => [],
	},
	/** Unassigned menu items (flat list) */
	unassignedItems: {
		type: Array,
		default: () => [],
	},
	/** Maximum depth for assigned items */
	maxAssignedDepth: {
		type: Number,
		default: 3,
	},
	/** Conditional warning messages by item type */
	conditionalWarnings: {
		type: Object,
		default: () => ({}),
	},
	/** Label for assigned items column */
	assignedLabel: {
		type: String,
		default: '',
	},
	/** Label for unassigned items column */
	unassignedLabel: {
		type: String,
		default: '',
	},
});

const emit = defineEmits([
	'update:assignedItems',
	'update:unassignedItems',
	'edit',
	'change',
]);

// Use composable for all drag-drop logic
const {
	localAssignedItems,
	localUnassignedItems,
	assignedItemsLocal,
	unassignedItemsLocal,
	isOverAssigned,
	isOverUnassigned,
	dropIndicator,
	dropIndicatorStyle,
	handleMove,
	handleEdit,
	setupDropZones,
	cleanup,
} = useNavigationMenuEditor(props, emit);

// Drop zone refs
const assignedDropZone = ref(null);
const unassignedDropZone = ref(null);

onMounted(() => {
	setupDropZones(assignedDropZone, unassignedDropZone);
});

onUnmounted(() => {
	cleanup();
});

defineExpose({
	localAssignedItems,
	localUnassignedItems,
});
</script>

<style lang="less">
@import '../../styles/_import';

// Minimal custom styles - most styling via Tailwind classes
.nav-menu-editor__container {
	&--drag-over {
		background-color: fadeout(@primary, 95%);
		border-color: @primary;
	}
}
</style>
