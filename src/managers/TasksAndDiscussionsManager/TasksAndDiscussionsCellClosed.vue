<template>
	<TableCell>
		<div class="flex items-center text-primary">
			<Icon :icon="icon" class="h-5 w-5"></Icon>
		</div>
	</TableCell>
</template>

<script setup>
import TableCell from '@/components/Table/TableCell.vue';
import Icon from '@/components/Icon/Icon.vue';

const props = defineProps({workItem: {type: Object, required: true}});
const icon = props.workItem?.closed ? 'CheckboxTicked' : 'Checkbox';
</script>
