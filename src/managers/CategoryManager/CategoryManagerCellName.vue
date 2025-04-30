<template>
	<TableCell>
		<span
			:class="{'font-bold': depth <= 2}"
			:style="{'padding-inline-start': `${depth - 0.9}rem`}"
		>
			{{ category.localizedTitle }}
		</span>
	</TableCell>
</template>

<script setup>
import TableCell from '@/components/Table/TableCell.vue';

defineProps({
	category: {type: Object, required: true},
	depth: {type: Number, default: 0},
});
</script>
