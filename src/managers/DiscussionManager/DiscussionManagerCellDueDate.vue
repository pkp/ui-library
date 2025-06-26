<template>
	<TableCell>
		<div class="flex items-center">
			<span class="text-base-normal">
				{{ workItem.dueDate }}
			</span>
		</div>
	</TableCell>
</template>

<script setup>
import TableCell from '@/components/Table/TableCell.vue';

defineProps({workItem: {type: Object, required: true}});
</script>
