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
					:is="column.componentName"
					v-for="column in columns"
					:key="column.id"
					:submission="submission"
				/>
			</TableRow>
		</TableBody>
	</PkpTable>
	<div class="submissions__list__footer">
		<span class="submission__list__showing" v-html="showingXofX"></span>
		<Pagination
			v-if="pagination.pageCount > 1"
			:current-page="pagination.currentPage"
			:is-loading="isLoadingPage"
			:last-page="pagination.pageCount"
			:show-adjacent-pages="3"
			@set-page="$emit((...args) => $emit('setPage', ...args))"
		></Pagination>
	</div>
</template>

<script>
import Pagination from '@/components/Pagination/Pagination.vue';
import PkpTable from '@/components/TableNext/Table.vue';
import TableColumn from '@/components/TableNext/TableColumn.vue';
import TableHeader from '@/components/TableNext/TableHeader.vue';
import TableBody from '@/components/TableNext/TableBody.vue';
import TableRow from '@/components/TableNext/TableRow.vue';

import ColumnActions from '@/pages/submissions/ColumnActions.vue';
import ColumnActivity from '@/pages/submissions/ColumnActivity.vue';
import ColumnDays from '@/pages/submissions/ColumnDays.vue';
import ColumnId from '@/pages/submissions/ColumnId.vue';
import ColumnStage from '@/pages/submissions/ColumnStage.vue';
import ColumnTitle from '@/pages/submissions/ColumnTitle.vue';

export default {
	components: {
		Pagination,
		PkpTable,
		TableBody,
		TableColumn,
		TableRow,
		TableHeader,
		ColumnActions,
		ColumnActivity,
		ColumnDays,
		ColumnId,
		ColumnStage,
		ColumnTitle,
	},
	props: {
		submissions: {type: Array, required: true},
		columns: {type: Array, required: true},
		sortDescriptor: {type: Object, required: true},
		pagination: {type: Object, required: true},
	},
	emits: ['setPage', 'sortColumn'],
	computed: {
		/**
		 * A localized string with a count of the submissions being viewed
		 *
		 * eg - Showing 1 to 30 of 170
		 */
		showingXofX() {
			return this.t('common.showingXofX', {
				start: this.pagination.firstItemIndex,
				finish: this.pagination.lastItemIndex,
				total: this.pagination.itemCount,
			});
		},
	},
};
</script>
