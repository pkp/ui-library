<template>
	<TableCell>
		<div class="ms-8 flex items-center">
			<span :id="`template_name_${template.id}`" class="text-lg-normal">
				{{ template.name }}
			</span>
		</div>
	</TableCell>
</template>

<script setup>
import TableCell from '@/components/Table/TableCell.vue';

defineProps({template: {type: Object, required: true}});
</script>
