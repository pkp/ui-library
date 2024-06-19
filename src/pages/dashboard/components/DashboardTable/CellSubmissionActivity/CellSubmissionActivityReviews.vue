<template>
	<div v-if="reviewAssignments.length">
		<span class="space-x-1">
			<CellSubmissionActivityReviewsItem
				v-for="reviewAssignment in reviewAssignments"
				:key="reviewAssignment.id"
				:review-assignment="reviewAssignment"
				@action="(...args) => emit('action', ...args)"
			></CellSubmissionActivityReviewsItem>
		</span>
	</div>
</template>
<script setup>
import CellSubmissionActivityReviewsItem from './CellSubmissionActivityReviewsItem.vue';

defineProps({reviewAssignments: {type: Array, required: true}});
const emit = defineEmits(['action']);
</script>
