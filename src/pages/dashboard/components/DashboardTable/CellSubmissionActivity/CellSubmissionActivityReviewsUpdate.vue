<template>
	<div class="flex">
		<Icon class="h-6 w-6 text-primary" icon="ReviewAssignments"></Icon>
		<div class="ms-1 flex items-center">
			{{ `Review update: (t) ${reviewsCompletedCount}/${reviewsTotalCount}` }}
		</div>
	</div>
</template>
<script setup>
import {computed} from 'vue';
import Icon from '@/components/Icon/Icon.vue';
import {useReviewAssignment} from '@/composables/useReviewAssignment';

const {getActiveReviewAssignments, getCompletedReviewAssignments} =
	useReviewAssignment();

const props = defineProps({
	reviewAssignments: {type: Array, required: true},
});

const reviewsTotalCount = computed(
	() => getActiveReviewAssignments(props.reviewAssignments).length,
);

const reviewsCompletedCount = computed(
	() => getCompletedReviewAssignments(props.reviewAssignments).length,
);
</script>
