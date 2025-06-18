<template>
	<TableCell>
		<div class="flex flex-col items-start">
			<span
				v-for="(activity, i) in workItem.activities"
				:key="i"
				class="my-1 text-base-normal"
			>
				{{ activity }}
			</span>
		</div>
	</TableCell>
</template>

<script setup>
import TableCell from '@/components/Table/TableCell.vue';

defineProps({workItem: {type: Object, required: true}});
</script>
