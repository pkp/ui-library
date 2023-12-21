import {ref, computed} from 'vue';
import PkpTable from './Table.vue';
import TableCell from './TableCell.vue';
import TableHeader from './TableHeader.vue';
import ButtonRow from '@/components/ButtonRow/ButtonRow.vue';
import Pagination from '@/components/Pagination/Pagination.vue';

import articleStats from '@/components/Table/mocks/articleStats.js';
import {useSorting} from '@/composables/useSorting';
export default {
	title: 'Components/Table',
	component: PkpTable,
};

export const Default = {
	render: (args) => ({
		components: {PkpTable, TableCell, TableHeader},
		setup() {
			const rows = articleStats.slice(0, 10);

			return {args, rows};
		},
		template: `
			<PkpTable>
				<template #caption>
					<PkpHeader>
						<h2>Example Table</h2>
					</PkpHeader>
				</template>
				<template #head>
					<TableHeader>ID</TableHeader>
					<TableHeader>Title</TableHeader>
					<TableHeader>Views</TableHeader>
					<TableHeader>Downloads</TableHeader>
					<TableHeader>Total</TableHeader>
				</template>
				<tr v-for="row in rows" :key="row.object.id">
					<TableCell>{{ row.object.id }}</TableCell>
					<TableCell :is-row-header="true">
						{{ row.object.fullTitle.en }}
					</TableCell>
					<TableCell>{{ row.views }}</TableCell>
					<TableCell>{{ row.downloads }}</TableCell>
					<TableCell>
						<button @click="open(row)">{{ row.total }}</button>
					</TableCell>
				</tr>
			</PkpTable>
		`,
	}),

	args: {},
};

export const WithSorting = {
	render: (args) => ({
		components: {PkpTable, TableCell, TableHeader},
		setup() {
			const rows = articleStats.slice(0, 10);
			const {sortDirection, sortColumnId, applySort} = useSorting();

			return {sortDirection, sortColumnId, applySort, args, rows};
		},
		template: `
			<PkpTable>
				<template #caption>
					<PkpHeader>
						<h2>Example Table with Sorting</h2>
					</PkpHeader>
				</template>
				<template #head>
					<TableHeader>ID</TableHeader>
					<TableHeader>Title</TableHeader>
					<TableHeader
						:can-sort="true"
						:sort-direction="sortColumnId === 'views' ? sortDirection : 'none'"
						@sort-column="applySort('views')"
					>
						Views
					</TableHeader>
					<TableHeader
						:can-sort="true"
						:sort-direction="sortColumnId === 'downloads' ? sortDirection : 'none'"
						@sort-column="applySort('downloads')"
					>
						Downloads
					</TableHeader>
					<TableHeader
						:can-sort="true"
						:sort-direction="sortColumnId === 'total' ? sortDirection : 'none'"
						@sort-column="applySort('total')"
					>
						Total
					</TableHeader>
				</template>
				<tr v-for="row in rows" :key="row.object.id">
					<TableCell>{{ row.object.id }}</TableCell>
					<TableCell :is-row-header="true">
						{{ row.object.fullTitle.en }}
					</TableCell>
					<TableCell>{{ row.views }}</TableCell>
					<TableCell>{{ row.downloads }}</TableCell>
					<TableCell>
						<button @click="open(row)">{{ row.total }}</button>
					</TableCell>
				</tr>
			</PkpTable>
		`,
	}),

	args: {},
};

export const WithPagination = {
	render: (args) => ({
		components: {PkpTable, TableCell, TableHeader, ButtonRow, Pagination},
		setup() {
			const currentPage = ref(1);
			const isLoading = ref(false);
			const perPage = ref(10);
			const rows = [...articleStats];

			const lastPage = computed(() => {
				return Math.floor(rows.length / perPage.value);
			});

			const currentRows = computed(() => {
				const start = currentPage.value * perPage.value - perPage.value;
				return rows.slice(start, start + perPage.value);
			});

			function setPage(page) {
				currentPage.value = page;
			}

			return {
				rows,
				perPage,
				isLoading,
				currentPage,
				lastPage,
				currentRows,
				setPage,
			};
		},
		template: `
			<PkpTable>
				<template #caption>
					<PkpHeader>
						<h2>Example Table</h2>
					</PkpHeader>
				</template>
				<template #head>
					<TableHeader>ID</TableHeader>
					<TableHeader>Title</TableHeader>
					<TableHeader>Views</TableHeader>
					<TableHeader>Downloads</TableHeader>
					<TableHeader>Total</TableHeader>
				</template>
				<tr v-for="row in currentRows" :key="row.object.id">
					<TableCell>{{ row.object.id }}</TableCell>
					<TableCell :is-row-header="true">
						{{ row.object.fullTitle.en }}
					</TableCell>
					<TableCell>{{ row.views }}</TableCell>
					<TableCell>{{ row.downloads }}</TableCell>
					<TableCell>
						<button @click="open(row)">{{ row.total }}</button>
					</TableCell>
				</tr>
			</PkpTable>
			<ButtonRow>
				<Pagination
					:current-page="currentPage"
					:last-page="lastPage"
					@set-page="setPage"
				/>
			</ButtonRow>
		`,
	}),

	args: {},
};
