<template>
	<PkpTable>
		<template #label v-if="label">
			<span v-html="label"></span>
		</template>
		<template #description v-if="description">
			<span v-html="description"></span>
		</template>
		<TableHeader>
			<TableColumn
				v-for="column in columns"
				:key="column.name"
				:id="column.name"
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
import JobsPage from '@/components/Container/JobsPage.vue';
import PkpTable from '@/components/TableNext/Table.vue';
import TableHeader from '@/components/TableNext/TableHeader.vue';
import TableColumn from '@/components/TableNext/TableColumn.vue';
import TableBody from '@/components/TableNext/TableBody.vue';
import TableRow from '@/components/TableNext/TableRow.vue';
import TableCell from '@/components/TableNext/TableCell.vue';
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
	extends: JobsPage,
};
</script>
