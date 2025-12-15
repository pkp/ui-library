<template>
	<TableCell>
		<div v-if="isTask" class="flex items-center">
			<span class="text-base-normal">
				{{ workItem.dateDue }}
			</span>
		</div>
	</TableCell>
</template>

<script setup>
import {computed} from 'vue';
import TableCell from '@/components/Table/TableCell.vue';

const props = defineProps({workItem: {type: Object, required: true}});
const isTask = computed(
	() => props.workItem?.type === pkp.const.EDITORIAL_TASK_TYPE_TASK,
);
</script>
