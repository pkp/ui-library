<template>
	<TableCell>
		<PkpButton
			class="-ms-3"
			:aria-describedby="'submission-title-' + item.id"
			:is-link="true"
			@click="
				dashboardPageStore.openReviewerForm({
					submissionId: item.submissionId,
				})
			"
		>
			{{ actionLabel }}
		</PkpButton>
	</TableCell>
</template>
<script setup>
import {defineProps, computed} from 'vue';
import PkpButton from '@/components/Button/Button.vue';
import TableCell from '@/components/Table/TableCell.vue';
import {useDashboardPageStore} from '@/pages/dashboard/dashboardPageStore.js';

const props = defineProps({
	item: {type: Object, required: true},
});

// TODO refine that further once more example is provided
// Plus localisation once the labels are settleed
const actionLabel = computed(() => {
	switch (props.item.status) {
		case pkp.const.REVIEW_ASSIGNMENT_STATUS_AWAITING_RESPONSE:
		case pkp.const.REVIEW_ASSIGNMENT_STATUS_RESPONSE_OVERDUE:
			return 'Respond to request';
		case pkp.const.REVIEW_ASSIGNMENT_STATUS_ACCEPTED:
		case pkp.const.REVIEW_ASSIGNMENT_STATUS_REVIEW_OVERDUE:
			return 'Finish review';
		default:
			return 'View';
	}
});

const dashboardPageStore = useDashboardPageStore();
</script>
