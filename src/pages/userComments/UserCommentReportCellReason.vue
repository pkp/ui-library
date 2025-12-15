<template>
	<TableCell class="max-w-[25em] truncate">
		<span v-strip-unsafe-html="item.note"></span>
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
