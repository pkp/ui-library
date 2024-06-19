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
							reviewAssignmentId: item.id,
						})
				"
			/>
		</div>
	</TableCell>
</template>

<script setup>
import {defineProps, computed} from 'vue';
import TableCell from '@/components/TableNext/TableCell.vue';
import CellReviewAssignmentActivityAlert from './CellReviewAssignmentActivity/CellReviewAssignmentActivityAlert.vue';
import {useDashboardPageStore} from '@/pages/dashboard/dashboardPageStore';

const Components = {
	CellReviewAssignmentActivityAlert,
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
