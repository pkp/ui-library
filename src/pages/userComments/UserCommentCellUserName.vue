<template>
	<TableCell>
		{{ item.userName }}
	</TableCell>
</template>

<script setup>
import TableCell from '@/components/Table/TableCell.vue';

defineProps({
	item: {
		type: Object,
		required: true,
	},
});
</script>
