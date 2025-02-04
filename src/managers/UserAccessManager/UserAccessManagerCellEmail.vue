<template>
	<TableCell>
		<span class="text-base-normal">
			{{ user.email }}
		</span>
	</TableCell>
</template>

<script setup>
import TableCell from '@/components/Table/TableCell.vue';

defineProps({
	user: {type: Object, required: true},
});
</script>
