<template>
	<TableCell :is-row-header="true">
		<span class="text-base-normal">
			CitationManagerCellToggleAll
		</span>
	</TableCell>
</template>

<script setup>
import TableCell from '@/components/Table/TableCell.vue';

const props = defineProps({
	// citation: {type: Object, required: true}
});
</script>
