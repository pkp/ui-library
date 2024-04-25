<template>
	<span class="space-x-1">
		<CellContentActivityReviewsItem
			v-for="reviewAssignment in reviewAssignments"
			:key="reviewAssignment.id"
			:review-assignment="reviewAssignment"
			@action="(...args) => emit('action', ...args)"
		></CellContentActivityReviewsItem>
	</span>
</template>

<script setup>
import CellContentActivityReviewsItem from './CellContentActivityReviewsItem.vue';
const emit = defineEmits('action');

defineProps({
	reviewAssignments: {type: Array, required: true},
});
</script>
