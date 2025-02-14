<template>
	<TableCell>
		<ReviewMethodIcons
			:review-method="reviewAssignment.reviewMethod"
		></ReviewMethodIcons>
	</TableCell>
</template>

<script setup>
import TableCell from '@/components/Table/TableCell.vue';
import ReviewMethodIcons from '@/components/ReviewMethodIcons/ReviewMethodIcons.vue';

defineProps({reviewAssignment: {type: Object, required: true}});
</script>
