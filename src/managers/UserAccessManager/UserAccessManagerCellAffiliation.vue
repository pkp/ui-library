<template>
	<TableCell>
		<span class="text-base-normal">
			{{ localize(user.affiliation) }}
		</span>
	</TableCell>
</template>

<script setup>
import TableCell from '@/components/Table/TableCell.vue';

defineProps({
	user: {type: Object, required: true},
});
</script>
