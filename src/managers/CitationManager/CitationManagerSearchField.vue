<template>
	<TableCell :is-row-header="false">
		<span class="text-base-normal">
			CitationManagerSearchField
		</span>
	</TableCell>
</template>

<script setup>
import TableCell from '@/components/Table/TableCell.vue';

const props = defineProps({
	// citation: {type: Object, required: true}
});
</script>
