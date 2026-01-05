<template>
	<div class="space-y-4">
		<!-- Menu Selection -->
		<div v-if="menus.length > 1" class="flex items-center gap-4">
			<label for="navigation-menu-select" class="text-sm-bold">
				{{ t('manager.navigationMenus') }}
			</label>
			<select
				id="navigation-menu-select"
				v-model="selectedMenuId"
				class="rounded border border-light px-3 py-2"
				@change="fetchMenuItems"
			>
				<option v-for="menu in menus" :key="menu.id" :value="menu.id">
					{{ menu.title }}
				</option>
			</select>
		</div>

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
			v-else-if="assignedItems && unassignedItems"
			:assigned-items="assignedItems"
			:unassigned-items="unassignedItems"
			:max-depth="maxDepth"
			:assigned-title="t('manager.navigationMenus.assignedMenuItems')"
			:unassigned-title="t('manager.navigationMenus.unassignedMenuItems')"
			@update:assigned-items="handleAssignedItemsUpdate"
			@update:unassigned-items="handleUnassignedItemsUpdate"
		/>
	</div>
</template>

<script setup>
import {ref, onMounted, watch} from 'vue';
import {useFetch} from '@/composables/useFetch';
import {useLocalize} from '@/composables/useLocalize';
import NavigationMenuEditor from './NavigationMenuEditor.vue';
import Spinner from '@/components/Spinner/Spinner.vue';

const {t} = useLocalize();

const props = defineProps({
	/**
	 * API URL for navigation menus
	 */
	apiUrl: {
		type: String,
		required: true,
	},
	/**
	 * Initial menu ID to load (optional)
	 */
	initialMenuId: {
		type: Number,
		default: null,
	},
	/**
	 * Maximum nesting depth
	 */
	maxDepth: {
		type: Number,
		default: 3,
	},
});

const emit = defineEmits([
	/**
	 * Emitted when assigned items are updated
	 */
	'update:assignedItems',
]);

// State
const menus = ref([]);
const selectedMenuId = ref(props.initialMenuId);
const assignedItems = ref(null);
const unassignedItems = ref(null);
const isLoading = ref(true);
const error = ref(null);

// Fetch all navigation menus
async function fetchMenus() {
	const {data, fetch, isSuccess} = useFetch(props.apiUrl, {
		method: 'GET',
	});

	await fetch();

	if (isSuccess.value && data.value?.items) {
		menus.value = data.value.items;

		// Select first menu if no initial menu specified
		if (!selectedMenuId.value && menus.value.length > 0) {
			selectedMenuId.value = menus.value[0].id;
		}

		// Fetch items for selected menu
		if (selectedMenuId.value) {
			await fetchMenuItems();
		}
	}
}

// Fetch items for the selected menu
async function fetchMenuItems() {
	if (!selectedMenuId.value) return;

	isLoading.value = true;
	error.value = null;

	const itemsUrl = `${props.apiUrl}/${selectedMenuId.value}/items`;
	const {data, fetch, isSuccess} = useFetch(itemsUrl, {
		method: 'GET',
	});

	await fetch();

	if (isSuccess.value && data.value) {
		assignedItems.value = data.value.assigned || [];
		unassignedItems.value = data.value.unassigned || [];
	} else {
		error.value = t('common.error');
	}

	isLoading.value = false;
}

// Handle assigned items update
function handleAssignedItemsUpdate(items) {
	assignedItems.value = items;
	emit('update:assignedItems', items);
}

// Handle unassigned items update
function handleUnassignedItemsUpdate(items) {
	unassignedItems.value = items;
}

// Watch for menu changes
watch(
	() => props.initialMenuId,
	(newMenuId) => {
		if (newMenuId && newMenuId !== selectedMenuId.value) {
			selectedMenuId.value = newMenuId;
			fetchMenuItems();
		}
	},
);

// Initial load
onMounted(() => {
	fetchMenus();
});
</script>
