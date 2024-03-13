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
			<TableRow v-for="submission in submissions" :key="submission.id">
				<component
					:is="columnComponents[column.componentName] || column.componentName"
					v-for="column in columns"
					:key="column.id"
					:submission="submission"
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

import ColumnSubmissionActions from './ColumnSubmissionActions.vue';
import ColumnSubmissionActivity from './ColumnSubmissionActivity.vue';
import ColumnSubmissionDays from './ColumnSubmissionDays.vue';
import ColumnSubmissionId from './ColumnSubmissionId.vue';
import ColumnSubmissionStage from './ColumnSubmissionStage.vue';
import ColumnSubmissionTitle from './ColumnSubmissionTitle.vue';

defineProps({
	submissions: {type: Array, required: true},
	columns: {type: Array, required: true},
	sortDescriptor: {type: Object, required: true},
	pagination: {type: Object, required: true},
});
const emit = defineEmits(['setPage', 'sortColumn']);

const columnComponents = {
	ColumnSubmissionActions,
	ColumnSubmissionActivity,
	ColumnSubmissionDays,
	ColumnSubmissionId,
	ColumnSubmissionStage,
	ColumnSubmissionTitle,
};
</script>
