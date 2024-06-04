<template>
	<TableCell>
		<div class="flex flex-col justify-center gap-y-2">
			<component
				:is="Components[config.component] || config.component"
				v-bind="config.props"
				v-for="(config, index) in cellConfig"
				:key="index"
				@action="
					(actionName, actionArgs) =>
						dashboardStore.handleItemAction(actionName, {
							...actionArgs,
							submissionId: item.id,
						})
				"
			/>
		</div>
	</TableCell>
</template>

<script setup>
import CellSubmissionActivityActionAlert from './CellSubmissionActivityActionAlert.vue';
import CellSubmissionActivityReviews from './CellSubmissionActivityReviews.vue';
import CellSubmissionActivityReviewsUpdate from './CellSubmissionActivityReviewsUpdate.vue';
import CellSubmissionActivityReviewsOpen from './CellSubmissionActivityReviewsOpen.vue';

import {defineProps, computed} from 'vue';
import TableCell from '@/components/TableNext/TableCell.vue';

import {
	useDashboardPageStore,
	DashboardPageTypes,
} from '@/pages/dashboard/dashboardPageStore';

const Components = {
	CellSubmissionActivityActionAlert,
	CellSubmissionActivityReviews,
	CellSubmissionActivityReviewsUpdate,
	CellSubmissionActivityReviewsOpen,
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
./CellActivityActionAlert.vue
