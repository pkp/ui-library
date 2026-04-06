<template>
	<div class="mt-6">
		<!-- Loading State -->
		<div v-if="isLoadingValue" class="flex h-64 items-center justify-center">
			<Spinner />
		</div>

		<!-- Editor -->
		<NavigationMenuEditor
			v-else
			:assigned-items="assignedItemsValue"
			:unassigned-items="unassignedItemsValue"
			:assigned-title="t('manager.navigationMenus.assignedMenuItems')"
			:unassigned-title="t('manager.navigationMenus.unassignedMenuItems')"
			@update:assigned-items="$emit('update:assignedItems', $event)"
			@update:unassigned-items="$emit('update:unassignedItems', $event)"
		/>
	</div>
</template>

<script setup>
import {computed, toValue} from 'vue';
import {useLocalize} from '@/composables/useLocalize';
import NavigationMenuEditor from '@/components/NavigationMenuEditor/NavigationMenuEditor.vue';
import Spinner from '@/components/Spinner/Spinner.vue';

const {t} = useLocalize();

const props = defineProps({
	assignedItems: {
		type: [Array, Object],
		default: () => [],
	},
	unassignedItems: {
		type: [Array, Object],
		default: () => [],
	},
	isLoading: {
		type: [Boolean, Object],
		default: false,
	},
});

defineEmits(['update:assignedItems', 'update:unassignedItems']);

// Handle both refs and plain values
const assignedItemsValue = computed(() => toValue(props.assignedItems));
const unassignedItemsValue = computed(() => toValue(props.unassignedItems));
const isLoadingValue = computed(() => toValue(props.isLoading));
</script>
