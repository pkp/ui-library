<template>
	<PkpTable aria-labelledby="table-title" aria-describedby="table-controls">
		<template #head>
			<TableHeader
				v-for="column in submissionsStore.columns"
				:key="column.id"
				:canSort="column.sortable"
				:sortDirection="
					submissionsStore.sortColumn === column.id ? sortDirection : 'none'
				"
			>
				{{ column.header }}
			</TableHeader>
		</template>
		<tr v-for="submission in submissionsStore.submissions" :key="submission.id">
			<component
				:is="column.componentName"
				v-for="column in submissionsStore.columns"
				:key="column.id"
				:submission="submission"
			/>
		</tr>
	</PkpTable>
	<div class="submissions__list__footer">
		<span
			class="submission__list__showing"
			v-html="submissionsStore.showingXofX"
		></span>
		<Pagination
			v-if="submissionsStore.lastPage > 1"
			:current-page="submissionsStore.currentPage"
			:is-loading="submissionsStore.isLoadingPage"
			:last-page="submissionsStore.lastPage"
			:show-adjacent-pages="3"
			@set-page="submissionsStore.setPage"
		></Pagination>
	</div>
</template>

<script>
import {mapStores} from 'pinia';

import Pagination from '@/components/Pagination/Pagination.vue';
import PkpTable from '@/components/TableNext/Table.vue';
import TableHeader from '@/components/TableNext/TableHeader.vue';
import ColumnActions from '@/pages/submissions/ColumnActions.vue';
import ColumnActivity from '@/pages/submissions/ColumnActivity.vue';
import ColumnDays from '@/pages/submissions/ColumnDays.vue';
import ColumnId from '@/pages/submissions/ColumnId.vue';
import ColumnStage from '@/pages/submissions/ColumnStage.vue';
import ColumnTitle from '@/pages/submissions/ColumnTitle.vue';

import {useSubmissionsStore} from '@/pages/submissions/submissionsStore';

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
	computed: {...mapStores(useSubmissionsStore)},
};
</script>
