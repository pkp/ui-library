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

import ColumnActions from '@/pages/submissions/ColumnActions.vue';
import ColumnActivity from '@/pages/submissions/ColumnActivity.vue';
import ColumnDays from '@/pages/submissions/ColumnDays.vue';
import ColumnId from '@/pages/submissions/ColumnId.vue';
import ColumnStage from '@/pages/submissions/ColumnStage.vue';
import ColumnTitle from '@/pages/submissions/ColumnTitle.vue';

defineProps({
	submissions: {type: Array, required: true},
	columns: {type: Array, required: true},
	sortDescriptor: {type: Object, required: true},
	pagination: {type: Object, required: true},
});
const emit = defineEmits(['setPage', 'sortColumn']);

const columnComponents = {
	ColumnActions,
	ColumnActivity,
	ColumnDays,
	ColumnId,
	ColumnStage,
	ColumnTitle,
};
</script>
