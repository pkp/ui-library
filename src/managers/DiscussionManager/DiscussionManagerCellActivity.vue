<template>
	<TableCell>
		<div class="flex flex-col items-start">
			<span class="my-1 text-base-normal">
				{{ workItem.latestActivities?.[0]?.message }}
			</span>
		</div>
	</TableCell>
</template>

<script setup>
import TableCell from '@/components/Table/TableCell.vue';

defineProps({workItem: {type: Object, required: true}});
</script>
