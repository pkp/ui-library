<template>
	<TableCell>
		<div class="flex items-center">
			<span class="text-base-normal">
				{{ mediaFile.size }}
			</span>
		</div>
	</TableCell>
</template>

<script setup>
import TableCell from '@/components/Table/TableCell.vue';

defineProps({mediaFile: {type: Object, required: true}});
</script>
