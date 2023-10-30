<template>
	<TableCell>{{ submission.id }}</TableCell>
</template>

<script>
import TableCell from '@/components/TableNext/TableCell.vue';

export default {
	components: {
		TableCell,
	},
	props: {
		submission: Object,
	},
};
</script>
