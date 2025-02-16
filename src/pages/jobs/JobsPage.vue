<template>
	<PkpTable>
		<template v-if="label" #label>
			<span v-strip-unsafe-html="label"></span>
		</template>
		<template v-if="description" #description>
			<span v-strip-unsafe-html="description"></span>
		</template>
		<TableHeader>
			<TableColumn
				v-for="column in columns"
				:id="column.name"
				:key="column.name"
			>
				{{ column.label }}
			</TableColumn>
		</TableHeader>
		<TableBody>
			<TableRow v-for="row in rows" :key="row.key">
				<TableCell>{{ row.id }}</TableCell>
				<TableCell>{{ row.displayName }}</TableCell>
				<TableCell>{{ row.queue }}</TableCell>
				<TableCell>{{ row.attempts }}</TableCell>
				<TableCell>{{ row.created_at }}</TableCell>
			</TableRow>
		</TableBody>
	</PkpTable>

	<Pagination
		v-if="lastPage > 1"
		:current-page="currentPage"
		:last-page="lastPage"
		:is-loading="isLoadingItems"
		@set-page="handlePagination"
	/>
</template>

<script>
import JobsPageBase from './JobsPageBase.vue';
import PkpTable from '@/components/Table/Table.vue';
import TableHeader from '@/components/Table/TableHeader.vue';
import TableColumn from '@/components/Table/TableColumn.vue';
import TableBody from '@/components/Table/TableBody.vue';
import TableRow from '@/components/Table/TableRow.vue';
import TableCell from '@/components/Table/TableCell.vue';
import Pagination from '@/components/Pagination/Pagination.vue';

export default {
	name: 'JobsPage',
	components: {
		PkpTable,
		TableHeader,
		TableColumn,
		TableBody,
		TableRow,
		TableCell,
		Pagination,
	},
	extends: JobsPageBase,
};
</script>
