<template>
	<TableCell>
		<div class="flex flex-col justify-center gap-y-2">
			<component
				:is="Components[config.component] || config.component"
				v-bind="config.props"
				v-for="(config, index) in cellConfig"
				:key="index"
			/>
		</div>
	</TableCell>
</template>

<script setup>
import DashboardCellSubmissionActivityActionAlert from './DashboardCellSubmissionActivityActionAlert.vue';
import DashboardCellSubmissionActivityReviews from './DashboardCellSubmissionActivityReviews.vue';
import DashboardCellSubmissionActivityReviewsUpdate from './DashboardCellSubmissionActivityReviewsUpdate.vue';
import DashboardCellSubmissionActivityReviewsOpen from './DashboardCellSubmissionActivityReviewsOpen.vue';

import {defineProps, computed} from 'vue';
import TableCell from '@/components/Table/TableCell.vue';

import {
	useDashboardPageStore,
	DashboardPageTypes,
} from '@/pages/dashboard/dashboardPageStore';

const Components = {
	DashboardCellSubmissionActivityActionAlert,
	DashboardCellSubmissionActivityReviews,
	DashboardCellSubmissionActivityReviewsUpdate,
	DashboardCellSubmissionActivityReviewsOpen,
};

const dashboardStore = useDashboardPageStore();
const props = defineProps({item: {type: Object, required: true}});

const cellConfig = computed(() => {
	if (dashboardStore.dashboardPage === DashboardPageTypes.EDITORIAL_DASHBOARD) {
		return dashboardStore.getEditorialActivityForEditorialDashboard(props.item);
	} else if (
		dashboardStore.dashboardPage === DashboardPageTypes.MY_SUBMISSIONS
	) {
		return dashboardStore.getEditorialActivityForMySubmissions(props.item);
	}

	return [];
});
</script>
