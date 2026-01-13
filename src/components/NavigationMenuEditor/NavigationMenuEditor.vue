<template>
	<div class="navigation-menu-editor w-full" data-cy="navigation-menu-editor">
		<!-- Two-panel layout -->
		<div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
			<!-- Assigned Menu Items Panel -->
			<MenuTreePanel
				:title="assignedPanelTitle"
				:items="assignedItems"
				:allow-nesting="true"
				:max-depth="maxDepth"
				:panel-id="PANEL_ASSIGNED"
				:empty-message="
					assignedEmptyMessage || t('manager.navigationMenu.noAssignedItems')
				"
				:indent-per-level="indentPerLevel"
				:can-drop="canDropOnTarget"
				data-cy="assigned-panel"
				@move="handleMove"
			/>

			<!-- Unassigned Menu Items Panel -->
			<MenuTreePanel
				:title="unassignedPanelTitle"
				:items="unassignedItems"
				:allow-nesting="false"
				:max-depth="1"
				:panel-id="PANEL_UNASSIGNED"
				:empty-message="
					unassignedEmptyMessage ||
					t('manager.navigationMenu.noUnassignedItems')
				"
				:indent-per-level="indentPerLevel"
				:can-drop="canDropOnTarget"
				data-cy="unassigned-panel"
				@move="handleMove"
			/>
		</div>
	</div>
</template>

<script setup>
import {computed, watch} from 'vue';
import {useLocalize} from '@/composables/useLocalize';
import {
	useNavigationMenuEditor,
	PANEL_ASSIGNED,
	PANEL_UNASSIGNED,
} from './useNavigationMenuEditor';
import MenuTreePanel from './MenuTreePanel.vue';

const {t} = useLocalize();

const props = defineProps({
	/**
	 * Assigned menu items - hierarchical tree (up to maxDepth levels)
	 */
	assignedItems: {
		type: Array,
		default: () => [],
	},
	/**
	 * Unassigned menu items - flat list
	 */
	unassignedItems: {
		type: Array,
		default: () => [],
	},
	/**
	 * Maximum nesting depth for assigned items
	 */
	maxDepth: {
		type: Number,
		default: 3,
	},
	/**
	 * Title for assigned panel
	 */
	assignedTitle: {
		type: String,
		default: '',
	},
	/**
	 * Title for unassigned panel
	 */
	unassignedTitle: {
		type: String,
		default: '',
	},
	/**
	 * Empty message for assigned panel
	 */
	assignedEmptyMessage: {
		type: String,
		default: '',
	},
	/**
	 * Empty message for unassigned panel
	 */
	unassignedEmptyMessage: {
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
});

const emit = defineEmits([
	/**
	 * Emitted when assigned items change
	 */
	'update:assignedItems',
	/**
	 * Emitted when unassigned items change
	 */
	'update:unassignedItems',
]);

// Initialize editor state
const {assignedItems, unassignedItems, handleMove, canDropOnTarget} =
	useNavigationMenuEditor({
		assignedItems: props.assignedItems,
		unassignedItems: props.unassignedItems,
		maxDepth: props.maxDepth,
	});

// Watch for changes and emit updates
watch(
	assignedItems,
	(newItems) => {
		emit('update:assignedItems', newItems);
	},
	{deep: true},
);

watch(
	unassignedItems,
	(newItems) => {
		emit('update:unassignedItems', newItems);
	},
	{deep: true},
);

// Panel titles with fallback to translations
const assignedPanelTitle = computed(() => {
	return props.assignedTitle || t('manager.navigationMenu.assigned');
});

const unassignedPanelTitle = computed(() => {
	return props.unassignedTitle || t('manager.navigationMenu.unassigned');
});
</script>
