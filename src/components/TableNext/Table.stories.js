import {ref, watch} from 'vue';
import PkpTable from './Table.vue';
import TableHeader from './TableHeader.vue';
import TableBody from './TableBody.vue';
import TableColumn from './TableColumn.vue';
import TableCell from './TableCell.vue';
import TableRow from './TableRow.vue';
import TablePagination from './TablePagination.vue';

import ButtonRow from '@/components/ButtonRow/ButtonRow.vue';
import {http, HttpResponse} from 'msw';

import articleStats from '@/components/Table/mocks/articleStats.js';
import {useSorting} from '@/composables/useSorting';

import {useFetchPaginated} from '@/composables/useFetchPaginated';
import {useApiUrl} from '@/composables/useApiUrl';

export default {
	title: 'Components/Table',
	component: PkpTable,
};

export const Default = {
	render: (args) => ({
		components: {
			PkpTable,
			TableHeader,
			TableBody,
			TableRow,
			TableColumn,
			TableCell,
		},
		setup() {
			const rows = articleStats.slice(0, 10);

			return {args, rows};
		},
		template: `
			<PkpTable aria-label="Example for basic table">
				<TableHeader>
					<TableColumn>ID</TableColumn>
					<TableColumn>Title</TableColumn>
					<TableColumn>Views</TableColumn>
					<TableColumn>Downloads</TableColumn>
					<TableColumn>Total</TableColumn>
				</TableHeader>
				<TableBody>
					<TableRow v-for="row in rows" :key="row.object.id">
						<TableCell>{{ row.object.id }}</TableCell>
						<TableCell :is-row-header="true">
							{{ row.object.fullTitle.en }}
						</TableCell>
						<TableCell>{{ row.views }}</TableCell>
						<TableCell>{{ row.downloads }}</TableCell>
						<TableCell>
							<button @click="open(row)">{{ row.total }}</button>
						</TableCell>
					</TableRow>
				</TableBody>
			</PkpTable>
		`,
	}),

	args: {},
};

export const WithSorting = {
	render: (args) => ({
		components: {
			PkpTable,
			TableHeader,
			TableBody,
			TableRow,
			TableColumn,
			TableCell,
		},
		setup() {
			const rows = articleStats.slice(0, 10);
			const {sortDescriptor, applySort} = useSorting();

			return {sortDescriptor, applySort, args, rows};
		},
		template: `
			<PkpTable 
				aria-label="Example Table with Sorting" 		
				:sort-descriptor="sortDescriptor"
				@sort="(columnId) => applySort(columnId)"
			>
				<TableHeader>
					<TableColumn id="id">ID</TableColumn>
					<TableColumn id="title">Title</TableColumn>
					<TableColumn id="views"
						:allows-sorting="true"
					>
						Views
					</TableColumn>
					<TableColumn id="downloads"
						:allows-sorting="true"
					>
						Downloads
					</TableColumn>
					<TableColumn id="total"
						:allows-sorting="true"
					>
						Total
					</TableColumn>
				</TableHeader>
				<TableBody>
					<TableRow v-for="row in rows" :key="row.object.id">
						<TableCell>{{ row.object.id }}</TableCell>
						<TableCell :is-row-header="true">
							{{ row.object.fullTitle.en }}
						</TableCell>
						<TableCell>{{ row.views }}</TableCell>
						<TableCell>{{ row.downloads }}</TableCell>
						<TableCell>
							<button @click="open(row)">{{ row.total }}</button>
						</TableCell>
					</TableRow>
				</TableBody>
			</PkpTable>
		`,
	}),

	args: {},
};

export const WithPagination = {
	render: (args) => ({
		components: {
			PkpTable,
			TableHeader,
			TableBody,
			TableRow,
			TableColumn,
			TableCell,
			ButtonRow,
			TablePagination,
		},
		setup() {
			const {apiUrl: statsApiUrl} = useApiUrl('stats');

			const pageSize = ref(10);
			const currentPage = ref(1);

			const {items, pagination, fetch} = useFetchPaginated(statsApiUrl, {
				currentPage,
				pageSize,
			});

			fetch();
			// reload after changing currentPage
			watch(async (currentPage) => await fetch());

			function setPage(page) {
				currentPage.value = page;
			}

			return {
				items,
				currentPage,
				pagination,
				setPage,
			};
		},
		template: `
			<PkpTable aria-label="Example Table with pagination">
				<TableHeader>
					<TableColumn>ID</TableColumn>
					<TableColumn>Title</TableColumn>
					<TableColumn>Views</TableColumn>
					<TableColumn>Downloads</TableColumn>
					<TableColumn>Total</TableColumn>
				</TableHeader>
				<TableBody>
					<TableRow v-for="row in items" :key="row.object.id">
						<TableCell>{{ row.object.id }}</TableCell>
						<TableCell :is-row-header="true">
							{{ row.object.fullTitle.en }}
						</TableCell>
						<TableCell>{{ row.views }}</TableCell>
						<TableCell>{{ row.downloads }}</TableCell>
						<TableCell>
							<button @click="open(row)">{{ row.total }}</button>
						</TableCell>
					</TableRow>
				</TableBody>
			</PkpTable>
			<TablePagination :pagination="pagination" @set-page="setPage"/>
		`,
	}),
	parameters: {
		msw: {
			handlers: [
				http.get(
					'https://mock/index.php/publicknowledge/api/v1/stats',
					({request}) => {
						const url = new URL(request.url);
						const offset = parseInt(url.searchParams.get('offset') || 0);
						const count = parseInt(url.searchParams.get('count'));
						const stats = articleStats.slice(offset, offset + count);

						return HttpResponse.json({
							itemsMax: articleStats.length,
							items: stats,
						});
					},
				),
			],
		},
	},

	args: {},
};
