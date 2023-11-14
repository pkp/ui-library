<template>
	<PkpTable aria-labelledby="table-title" aria-describedby="table-controls">
		<template #head>
			<TableHeader
				v-for="column in columns"
				:key="column.id"
				:can-sort="column.sortable"
				:sort-direction="sortColumn === column.id ? sortDirection : 'none'"
				@sort-column="$emit('sortColumn', column.id)"
			>
				{{ column.header }}
			</TableHeader>
		</template>
		<tr v-for="submission in submissions" :key="submission.id">
			<component
				:is="column.componentName"
				v-for="column in columns"
				:key="column.id"
				:submission="submission"
			/>
		</tr>
	</PkpTable>
	<div class="submissions__list__footer">
		<span class="submission__list__showing" v-html="showingXofX"></span>
		<Pagination
			v-if="pagination.pageCount > 1"
			:current-page="currentPage"
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
import TableHeader from '@/components/TableNext/TableHeader.vue';
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
		sortColumn: {type: String, required: true},
		sortDirection: {type: String, required: true},
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
