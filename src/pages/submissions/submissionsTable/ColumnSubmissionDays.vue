<template>
	<TableCell>TODO</TableCell>
</template>
<script setup>
import {defineProps} from 'vue';
import TableCell from '@/components/TableNext/TableCell.vue';

defineProps({
	item: {type: Object, required: true},
});
</script>
