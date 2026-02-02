<template>
	<TableCell>
		<div class="flex items-center">
			<Badge>{{ mediaFile.type }}</Badge>
		</div>
	</TableCell>
</template>

<script setup>
import TableCell from '@/components/Table/TableCell.vue';
import Badge from '@/components/Badge/Badge.vue';

defineProps({mediaFile: {type: Object, required: true}});
</script>
