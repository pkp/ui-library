<template>
	<TableCell>
		<span>{{ author.fullName }}</span>
	</TableCell>
</template>
<script setup>
import TableCell from '@/components/Table/TableCell.vue';

defineProps({
	author: {type: Object, required: true},
});
</script>
