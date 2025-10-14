<template>
	<TableCell :is-row-header="true">
		<div class="ms-8 flex items-center">
			<span :id="`template_name_${taskTemplate.id}`" class="text-lg-normal">
				{{ taskTemplate.title }}
			</span>
		</div>
	</TableCell>
</template>

<script setup>
import TableCell from '@/components/Table/TableCell.vue';

defineProps({taskTemplate: {type: Object, required: true}});
</script>
