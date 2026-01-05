<template>
	<div class="navigation-menu-editor-panel">
		<!-- Loading State -->
		<div v-if="isLoading" class="flex h-64 items-center justify-center">
			<Spinner />
		</div>

		<!-- Error State -->
		<div
			v-else-if="error"
			class="bg-negative-bg rounded border border-negative p-4 text-negative"
		>
			{{ error }}
		</div>

		<!-- Navigation Menu Editor -->
		<NavigationMenuEditor
			v-else-if="assignedItems !== null && unassignedItems !== null"
			:assigned-items="assignedItems"
			:unassigned-items="unassignedItems"
			:max-depth="maxDepth"
			:assigned-title="t('manager.navigationMenus.assignedMenuItems')"
			:unassigned-title="t('manager.navigationMenus.unassignedMenuItems')"
			@update:assigned-items="onAssignedItemsUpdate"
			@update:unassigned-items="onUnassignedItemsUpdate"
		/>
	</div>
</template>

<script setup>
import {onMounted, watch} from 'vue';
import {useLocalize} from '@/composables/useLocalize';
import {useNavigationMenuApi} from './composables/useNavigationMenuApi';
import {DEFAULT_MAX_DEPTH} from './constants';
import NavigationMenuEditor from './NavigationMenuEditor.vue';
import Spinner from '@/components/Spinner/Spinner.vue';

const {t} = useLocalize();

const props = defineProps({
	/**
	 * The navigation menu ID to edit
	 */
	navigationMenuId: {
		type: [String, Number],
		required: true,
	},
	/**
	 * API URL base for navigation menus
	 */
	apiUrl: {
		type: String,
		required: true,
	},
	/**
	 * Maximum nesting depth
	 */
	maxDepth: {
		type: Number,
		default: DEFAULT_MAX_DEPTH,
	},
});

// Use the API composable
const {
	assignedItems,
	unassignedItems,
	isLoading,
	error,
	fetchMenuItems,
	handleAssignedItemsUpdate,
	handleUnassignedItemsUpdate,
	updateFormFields,
} = useNavigationMenuApi();

// Fetch items on load
async function loadMenuItems() {
	await fetchMenuItems(props.apiUrl, props.navigationMenuId);
	updateFormFields();
}

// Handle assigned items update
function onAssignedItemsUpdate(items) {
	handleAssignedItemsUpdate(items);
}

// Handle unassigned items update
function onUnassignedItemsUpdate(items) {
	handleUnassignedItemsUpdate(items);
}

// Watch for navigation menu ID changes
watch(
	() => props.navigationMenuId,
	() => {
		loadMenuItems();
	},
);

// Initial load
onMounted(() => {
	loadMenuItems();
});
</script>
