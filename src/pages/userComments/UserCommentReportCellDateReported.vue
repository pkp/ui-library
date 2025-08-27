<template>
	<TableCell>
		{{ formatShortDate(item.createdAt) }}
	</TableCell>
</template>

<script setup>
import TableCell from '@/components/Table/TableCell.vue';
import {useDate} from '@/composables/useDate';

const {formatShortDate} = useDate();

defineProps({
	item: {
		type: Object,
		required: true,
	},
});
</script>
