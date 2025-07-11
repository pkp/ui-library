<template>
	<TableCell :is-row-header="false">
		<span class="text-base-normal">
			{{ props.citation }}
		</span>
	</TableCell>
</template>

<script setup>
import TableCell from '@/components/Table/TableCell.vue';

const props = defineProps({
	citation: {type: Object, required: true},
	useStructuredCitations: {type: Boolean, required: true},
	isRowExpanded: {type: Boolean, required: true },
});
</script>
