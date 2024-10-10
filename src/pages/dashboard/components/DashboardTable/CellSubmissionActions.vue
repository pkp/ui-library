<template>
	<TableCell>
		<PkpButton
			class="-ms-3"
			:aria-describedby="'submission-title-' + item.id"
			:is-link="true"
			@click="handleAction"
		>
			{{ t('common.view') }}
		</PkpButton>
	</TableCell>
</template>
<script setup>
import {defineProps} from 'vue';
import PkpButton from '@/components/Button/Button.vue';
import TableCell from '@/components/Table/TableCell.vue';
import {useDashboardPageStore} from '@/pages/dashboard/dashboardPageStore.js';

const props = defineProps({
	item: {type: Object, required: true},
});

function handleAction() {
	if (props.item.submissionProgress) {
		dashboardPageStore.openSubmissionWizard(props.item.id);
	} else {
		dashboardPageStore.openWorkflowModal(props.item.id);
	}
}

const dashboardPageStore = useDashboardPageStore();
</script>
