<template>
	<PkpTable
		:sort-descriptor="sortDescriptor"
		@sort="(columnId) => $emit('sortColumn', columnId)"
	>
		<TableHeader>
			<TableColumn
				v-for="column in columns"
				:id="column.id"
				:key="column.id"
				:allows-sorting="column.sortable"
			>
				{{ column.header }}
			</TableColumn>
		</TableHeader>
		<TableBody>
			<TableRow v-for="item in items" :key="item.id">
				<component
					:is="cellComponents[column.componentName] || column.componentName"
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
import PkpTable from '@/components/TableNext/Table.vue';
import TableColumn from '@/components/TableNext/TableColumn.vue';
import TableHeader from '@/components/TableNext/TableHeader.vue';
import TableBody from '@/components/TableNext/TableBody.vue';
import TableRow from '@/components/TableNext/TableRow.vue';
import TablePagination from '@/components/TableNext/TablePagination.vue';

import CellSubmissionActions from './CellSubmissionActions.vue';
import CellSubmissionActivity from './CellSubmissionActivity/CellSubmissionActivity.vue';
import CellSubmissionDays from './CellSubmissionDays.vue';
import CellSubmissionId from './CellSubmissionId.vue';
import CellSubmissionStage from './CellSubmissionStage.vue';
import CellSubmissionTitle from './CellSubmissionTitle.vue';

import CellReviewAssignmentId from './CellReviewAssignmentId.vue';
import CellReviewAssignmentTitle from './CellReviewAssignmentTitle.vue';
import CellReviewAssignmentActivity from './CellReviewAssignmentActivity.vue';
import CellReviewAssignmentActions from './CellReviewAssignmentActions.vue';

defineProps({
	items: {type: Array, required: true},
	columns: {type: Array, required: true},
	sortDescriptor: {type: Object, required: true},
	pagination: {type: Object, required: true},
});
const emit = defineEmits(['setPage', 'sortColumn']);

const cellComponents = {
	CellSubmissionActions,
	CellSubmissionActivity,
	CellSubmissionDays,
	CellSubmissionId,
	CellSubmissionStage,
	CellSubmissionTitle,
	CellReviewAssignmentId,
	CellReviewAssignmentTitle,
	CellReviewAssignmentActivity,
	CellReviewAssignmentActions,
};
</script>
