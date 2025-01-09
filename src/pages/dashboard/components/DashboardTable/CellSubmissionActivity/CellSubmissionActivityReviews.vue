<template>
	<div v-if="reviewAssignments.length">
		<span class="flex gap-x-1">
			<CellSubmissionActivityReviewsItem
				v-for="reviewAssignment in reviewAssignments"
				:key="reviewAssignment.id"
				:review-assignment="reviewAssignment"
				@action="
					(actionName, {reviewAssignment}) =>
						handleAction(actionName, {reviewAssignment})
				"
			></CellSubmissionActivityReviewsItem>
		</span>
	</div>
</template>
<script setup>
import {useDashboardPageStore} from '@/pages/dashboard/dashboardPageStore';
import CellSubmissionActivityReviewsItem from './CellSubmissionActivityReviewsItem.vue';

const props = defineProps({
	submissionId: {type: Number, required: true},
	reviewAssignments: {type: Array, required: true},
});

const dashboardStore = useDashboardPageStore();

function handleAction(actionName, {reviewAssignment}) {
	dashboardStore[actionName]({
		reviewAssignment: reviewAssignment,
		submissionId: props.submissionId,
	});
}
</script>
