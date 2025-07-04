import {ref, watch, computed} from 'vue';
import PkpTable from './Table.vue';
import TableHeader from './TableHeader.vue';
import TableBody from './TableBody.vue';
import TableColGroup from './TableColGroup.vue';
import TableColumn from './TableColumn.vue';
import TableCell from './TableCell.vue';
import TableRow from './TableRow.vue';
import TableRowGroup from './TableRowGroup.vue';
import PkpButton from '@/components/Button/Button.vue';
import TablePagination from './TablePagination.vue';

import ButtonRow from '@/components/ButtonRow/ButtonRow.vue';
import {http, HttpResponse} from 'msw';

import articleStats from '@/components/Table/mocks/articleStats.js';
import multiLevelHeaders from '@/components/Table/mocks/multiLevelHeaders';
import {useSorting} from '@/composables/useSorting';

import {useFetchPaginated} from '@/composables/useFetchPaginated';
import {useUrl} from '@/composables/useUrl';

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
			PkpButton,
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
					<TableColumn>Action</TableColumn>
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
						<TableCell>
							<PkpButton size-variant="compact" >View</PkpButton>
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
			const {apiUrl: statsApiUrl} = useUrl('stats');

			const pageSize = ref(11);
			const currentPage = ref(1);

			const {items, pagination, fetch} = useFetchPaginated(statsApiUrl, {
				currentPage,
				pageSize,
			});

			fetch();
			// reload after changing currentPage
			watch(currentPage, async (currentPage) => await fetch());

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

export const WithTitleAndDescription = {
	render: (args) => ({
		components: {
			PkpTable,
			TableHeader,
			TableBody,
			TableRow,
			TableColumn,
			TableCell,
			PkpButton,
		},
		setup() {
			const rows = articleStats.slice(0, 10);

			return {args, rows};
		},
		template: `
			<PkpTable>
				<template #label>
					View Failed Jobs
				</template>
				<template #description>
					There's a total of <strong>7</strong> failed job(s).
				</template>
				<template #top-controls>
					<PkpButton>Requeue All Failed Jobs</PkpButton>
				</template>
				<TableHeader>
					<TableColumn>ID</TableColumn>
					<TableColumn>Title</TableColumn>
					<TableColumn>Views</TableColumn>
					<TableColumn>Downloads</TableColumn>
					<TableColumn>Total</TableColumn>
					<TableColumn>Action</TableColumn>
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
						<TableCell>
							<PkpButton size-variant="compact" >View</PkpButton>
						</TableCell>

					</TableRow>
				</TableBody>
				<template #bottom-controls>
					<PkpButton :is-link="true">Download All Files</PkpButton>
				</template>
			</PkpTable>
		`,
	}),

	args: {},
};

export const WithNoItems = {
	render: (args) => ({
		components: {
			PkpTable,
			TableHeader,
			TableBody,
			TableRow,
			TableColumn,
			TableCell,
			PkpButton,
		},
		setup() {
			return {args};
		},
		template: `
			<PkpTable>
				<template #label>
					No Items
				</template>
				<template #description>
					There's a total of <strong>0</strong> items(s).
				</template>
				<TableHeader>
					<TableColumn>ID</TableColumn>
					<TableColumn>Title</TableColumn>
					<TableColumn>Views</TableColumn>
					<TableColumn>Downloads</TableColumn>
					<TableColumn>Total</TableColumn>
					<TableColumn>Action</TableColumn>
				</TableHeader>
				<TableBody>
					<template #no-content>
						This is a custom no-content slot. No items available.
					</template>
				</TableBody>
			</PkpTable>
		`,
	}),

	args: {},
};

export const MultiLevelHeaders = {
	render: (args) => ({
		components: {
			PkpTable,
			TableHeader,
			TableBody,
			TableRow,
			TableRowGroup,
			TableColumn,
			TableColGroup,
			TableCell,
			PkpButton,
		},
		setup() {
			const multiLevelTableMock = ref(multiLevelHeaders);

			const groups = computed(() => {
				return [
					{
						name: 'Pending',
						items: multiLevelTableMock.value.filter(
							(item) => item.status === 'Pending',
						),
					},
					{
						name: 'In Progress',
						items: multiLevelTableMock.value.filter(
							(item) => item.status === 'In Progress',
						),
					},
					{
						name: 'Completed',
						items: multiLevelTableMock.value.filter(
							(item) => item.status === 'Completed',
						),
					},
				];
			});

			return {args, groups};
		},
		template: `
			<PkpTable>
				<template #label>
					Multi Level Headers
				</template>
				<template #description>
					Grouped by: <strong>Status</strong>
				</template>
				<TableHeader>
					<TableColumn>ID</TableColumn>
					<TableColumn>Title</TableColumn>
					<TableColumn>Action</TableColumn>
				</TableHeader>
				<TableBody>
					<template v-for="group in groups" :key="group.name">
						<TableRowGroup>
							<TableRow>
								<TableColGroup>
									{{ group.name }}
								</TableColGroup>
							</TableRow>
							<TableRow v-for="row in group.items" :key="row.id" :striped="false">
								<TableCell>{{ row.id }}</TableCell>
								<TableCell>{{ row.title }}</TableCell>
								<TableCell>
									<PkpButton :is-link="true">View</PkpButton>
								</TableCell>
							</TableRow>
						</TableRowGroup>
					</template>
				</TableBody>
			</PkpTable>
		`,
	}),

	args: {},
};

export const EmptyMultiLevelHeaders = {
	render: (args) => ({
		components: {
			PkpTable,
			TableHeader,
			TableBody,
			TableRow,
			TableRowGroup,
			TableColumn,
			TableColGroup,
			TableCell,
			PkpButton,
		},
		setup() {
			const multiLevelTableMock = ref(multiLevelHeaders);

			const groups = computed(() => {
				return [
					{
						name: 'Pending',
						items: multiLevelTableMock.value.filter(
							(item) => item.status === 'Pending',
						),
					},
					{
						name: 'In Progress',
						items: [],
					},
					{
						name: 'Completed',
						items: [],
					},
				];
			});

			return {args, groups};
		},
		template: `
			<PkpTable>
				<template #label>
					Empty Multi Level Headers
				</template>
				<template #description>
					Grouped by: <strong>Status</strong>
				</template>
				<TableHeader>
					<TableColumn>ID</TableColumn>
					<TableColumn>Title</TableColumn>
					<TableColumn>Action</TableColumn>
				</TableHeader>
				<TableBody>
					<template v-for="group in groups" :key="group.name">
						<TableRowGroup>
							<TableRow>
								<TableColGroup>
									{{ group.name }}
								</TableColGroup>
							</TableRow>
							<TableRow v-for="row in group.items" :key="row.id" :striped="false">
								<TableCell>{{ row.id }}</TableCell>
								<TableCell>{{ row.title }}</TableCell>
								<TableCell>
									<PkpButton :is-link="true">View</PkpButton>
								</TableCell>
							</TableRow>
							<template #no-group-content>
								This is a custom no-group-content slot. No items available for status "{{ group.name }}".
							</template>
						</TableRowGroup>
					</template>
				</TableBody>
			</PkpTable>
		`,
	}),

	args: {},
};
