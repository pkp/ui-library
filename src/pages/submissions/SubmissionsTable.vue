<template>
	<PkpTable aria-labelledby="table-title" aria-describedby="table-controls">
		<template #head>
			<TableHeader
				v-for="column in $store.submissions.columns"
				:key="column.id"
				:canSort="column.sortable"
				:sortDirection="
					$store.submissions.sortColumn === column.id ? sortDirection : 'none'
				"
			>
				{{ column.header }}
			</TableHeader>
		</template>
		<tr
			v-for="submission in $store.submissions.submissions"
			:key="submission.id"
		>
			<component
				:is="column.componentName"
				v-for="column in $store.submissions.columns"
				:key="column.id"
				:submission="submission"
			/>
		</tr>
	</PkpTable>
	<div class="submissions__list__footer">
		<span
			class="submission__list__showing"
			v-html="$store.submissions.showingXofX"
		></span>
		<Pagination
			v-if="$store.submissions.lastPage > 1"
			:current-page="$store.submissions.currentPage"
			:is-loading="$store.submissions.isLoadingPage"
			:last-page="$store.submissions.lastPage"
			:show-adjacent-pages="3"
			@set-page="$store.submissions.setPage"
		></Pagination>
	</div>
</template>

<script>
import Pagination from '@/components/Pagination/Pagination.vue';
import PkpTable from '@/components/TableNext/Table.vue';
import TableHeader from '@/components/TableNext/TableHeader.vue';
import ColumnActions from '@/pages/submissions/columnActions.vue';
import ColumnActivity from '@/pages/submissions/columnActivity.vue';
import ColumnDays from '@/pages/submissions/columnDays.vue';
import ColumnId from '@/pages/submissions/columnId.vue';
import ColumnStage from '@/pages/submissions/columnStage.vue';
import ColumnTitle from '@/pages/submissions/columnTitle.vue';

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
};
</script>
