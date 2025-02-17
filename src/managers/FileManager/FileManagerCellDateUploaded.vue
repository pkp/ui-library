<template>
	<TableCell no-wrap>
		<span class="text-base-normal text-default">
			{{ formatShortDate(file.createdAt) }}
		</span>
	</TableCell>
</template>

<script setup>
import TableCell from '@/components/Table/TableCell.vue';
import {useDate} from '@/composables/useDate';

const {formatShortDate} = useDate();

defineProps({
	file: {type: Object, required: true},
});
</script>
