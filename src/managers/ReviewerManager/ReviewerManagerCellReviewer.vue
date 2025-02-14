<template>
	<TableCell :is-row-header="true">
		<span class="text-base-normal">
			{{ reviewAssignment.reviewerFullName }}
		</span>
	</TableCell>
</template>

<script setup>
import TableCell from '@/components/Table/TableCell.vue';

defineProps({reviewAssignment: {type: Object, required: true}});
</script>
