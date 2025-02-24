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
import {defineProps, computed} from 'vue';
import TableCell from '@/components/Table/TableCell.vue';
import DashboardCellReviewAssignmentActivityAlert from './DashboardCellReviewAssignmentActivityAlert.vue';
import {useDashboardPageStore} from '@/pages/dashboard/dashboardPageStore';

const Components = {
	DashboardCellReviewAssignmentActivityAlert,
};

const dashboardStore = useDashboardPageStore();

const props = defineProps({item: {type: Object, required: true}});

const cellConfig = computed(() => {
	const config = dashboardStore.getEditorialActivityForMyReviewAssignments(
		props.item,
	);
	return config;
});
</script>
