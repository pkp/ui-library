<template>
	<PkpTable
		:sort-descriptor="sortDescriptor"
		@sort="(columnId) => $emit('sortColumn', columnId)"
	>
		<TableHeader>
			<TableColumn v-if="dashboardStore.bulkDeleteSelectionEnabled">
				<span class="sr-only">
					{{
						t('dashboard.submissions.incomplete.bulkDelete.column.description')
					}}
				</span>
			</TableColumn>
			<TableColumn
				v-for="column in columns"
				:id="column.id"
				:key="column.id"
				:allows-sorting="column.sortable"
			>
				{{ column.header }}
			</TableColumn>
		</TableHeader>
		<TableBody
			:empty-text="
				dashboardStore.isSubmissionsLoading
					? t('common.loading')
					: t('grid.noItems')
			"
		>
			<TableRow v-for="item in items" :key="item.id">
				<DashboardCellBulkDelete
					v-if="dashboardStore.bulkDeleteSelectionEnabled"
					:item="item"
				/>
				<component
					:is="cellComponents[column.component] || column.component"
					v-for="column in columns"
					:key="column.id"
					:item="item"
				/>
			</TableRow>
		</TableBody>
	</PkpTable>
	<TablePagination
		:pagination="pagination"
		@set-page="(...args) => emit('setPage', ...args)"
	></TablePagination>
</template>

<script setup>
import {defineProps} from 'vue';
import PkpTable from '@/components/Table/Table.vue';
import TableColumn from '@/components/Table/TableColumn.vue';
import TableHeader from '@/components/Table/TableHeader.vue';
import TableBody from '@/components/Table/TableBody.vue';
import TableRow from '@/components/Table/TableRow.vue';
import TablePagination from '@/components/Table/TablePagination.vue';
import DashboardCellBulkDelete from './DashboardCellBulkDelete.vue';
import DashboardCellSubmissionActions from './DashboardCellSubmissionActions.vue';
import DashboardCellSubmissionActivity from './DashboardCellSubmissionActivity/DashboardCellSubmissionActivity.vue';
import DashboardCellSubmissionDays from './DashboardCellSubmissionDays.vue';
import DashboardCellSubmissionId from './DashboardCellSubmissionId.vue';
import DashboardCellSubmissionStage from './DashboardCellSubmissionStage.vue';
import DashboardCellSubmissionTitle from './DashboardCellSubmissionTitle.vue';

import DashboardCellReviewAssignmentId from './DashboardCellReviewAssignmentId.vue';
import DashboardCellReviewAssignmentTitle from './DashboardCellReviewAssignmentTitle.vue';
import DashboardCellReviewAssignmentActivity from './DashboardCellReviewAssignmentActivity/DashboardCellReviewAssignmentActivity.vue';
import DashboardCellReviewAssignmentActions from './DashboardCellReviewAssignmentActions.vue';

import {useDashboardPageStore} from '@/pages/dashboard/dashboardPageStore';

defineProps({
	items: {type: Array, required: true},
	columns: {type: Array, required: true},
	sortDescriptor: {type: Object, required: true},
	pagination: {type: Object, required: true},
});
const emit = defineEmits(['setPage', 'sortColumn']);

const cellComponents = {
	DashboardCellSubmissionActions,
	DashboardCellSubmissionActivity,
	DashboardCellSubmissionDays,
	DashboardCellSubmissionId,
	DashboardCellSubmissionStage,
	DashboardCellSubmissionTitle,
	DashboardCellReviewAssignmentId,
	DashboardCellReviewAssignmentTitle,
	DashboardCellReviewAssignmentActivity,
	DashboardCellReviewAssignmentActions,
};

const dashboardStore = useDashboardPageStore();
</script>
