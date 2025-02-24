<template>
	<div v-if="reviewAssignments.length">
		<span class="flex gap-x-1">
			<DashboardCellSubmissionActivityReviewsItem
				v-for="reviewAssignment in reviewAssignments"
				:key="reviewAssignment.id"
				:review-assignment="reviewAssignment"
				@action="
					(actionName, {reviewAssignment}) =>
						handleAction(actionName, {reviewAssignment})
				"
			></DashboardCellSubmissionActivityReviewsItem>
		</span>
	</div>
</template>
<script setup>
import {useDashboardPageStore} from '@/pages/dashboard/dashboardPageStore';
import DashboardCellSubmissionActivityReviewsItem from './DashboardCellSubmissionActivityReviewsItem.vue';

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
