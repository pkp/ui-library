<template>
	<TableCell fit-content>{{ item.submissionId }}</TableCell>
</template>

<script setup>
import {defineProps} from 'vue';
import TableCell from '@/components/Table/TableCell.vue';

defineProps({
	item: {type: Object, required: true},
});
</script>
