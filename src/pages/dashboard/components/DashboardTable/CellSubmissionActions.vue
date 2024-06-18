<template>
	<TableCell>
		<PkpButton
			class="-ms-3"
			:aria-describedby="'submission-title-' + item.id"
			:is-link="true"
			@click="dashboardPageStore.openSummaryModal(item.id)"
		>
			{{ t('dashboard.viewSummary') }}
		</PkpButton>
	</TableCell>
</template>
<script setup>
import {defineProps} from 'vue';
import PkpButton from '@/components/Button/Button.vue';
import TableCell from '@/components/TableNext/TableCell.vue';
import {useDashboardPageStore} from '@/pages/dashboard/dashboardPageStore.js';

defineProps({
	item: {type: Object, required: true},
});
const dashboardPageStore = useDashboardPageStore();
</script>
