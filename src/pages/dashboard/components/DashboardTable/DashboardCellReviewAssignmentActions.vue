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
import {useLocalize} from '@/composables/useLocalize';

const {t} = useLocalize();

const props = defineProps({
	item: {type: Object, required: true},
});

const actionLabel = computed(() => {
	switch (props.item.status) {
		case pkp.const.REVIEW_ASSIGNMENT_STATUS_AWAITING_RESPONSE:
		case pkp.const.REVIEW_ASSIGNMENT_STATUS_RESPONSE_OVERDUE:
		case pkp.const.REVIEW_ASSIGNMENT_STATUS_REQUEST_RESEND:
			return t('dashboard.actions.respondToRequest');
		case pkp.const.REVIEW_ASSIGNMENT_STATUS_ACCEPTED:
		case pkp.const.REVIEW_ASSIGNMENT_STATUS_REVIEW_OVERDUE:
			return t('dashboard.actions.finishReview');
		default:
			return t('common.view');
	}
});

const dashboardPageStore = useDashboardPageStore();
</script>
