<template>
	<!--<TableCellSelect :value="isChecked" @change="toggle"></TableCellSelect>-->

	<TableCellSelect
		v-if="canBeDeleted"
		:checked="isChecked"
		:described-by="'submission-title-' + item.id"
		@change="change"
	/>
	<TableCell v-else></TableCell>
</template>

<script setup>
import {computed} from 'vue';
import TableCellSelect from '@/components/Table/TableCellSelect.vue';
import TableCell from '@/components/Table/TableCell.vue';

import {useDashboardPageStore} from '@/pages/dashboard/dashboardPageStore';

const props = defineProps({item: {type: Object, required: true}});
const dashboardStore = useDashboardPageStore();

const isChecked = computed(() => {
	return dashboardStore.bulkDeleteSelectedItems.includes(props.item.id);
});

const canBeDeleted = computed(() => {
	return dashboardStore.bulkDeleteSubmissionIdsCanBeDeleted.includes(
		props.item.id,
	);
});

function change(checked) {
	if (checked) {
		dashboardStore.bulkDeleteSelectItem(props.item.id);
	} else {
		dashboardStore.bulkDeleteDeselectItem(props.item.id);
	}
}
</script>
