<template>
	<pkp-table>
		<pkp-header slot="caption">
			<h2>Example Table with Sorting</h2>
		</pkp-header>
		<template slot="head">
			<table-header>ID</table-header>
			<table-header>Title</table-header>
			<table-header
				:canSort="true"
				:sortDirection="sortColumn === 'views' ? sortDirection : 'none'"
				@table:sort="sort('views')"
			>
				Views
			</table-header>
			<table-header
				:canSort="true"
				:sortDirection="sortColumn === 'downloads' ? sortDirection : 'none'"
				@table:sort="sort('downloads')"
			>
				Downloads
			</table-header>
			<table-header
				:canSort="true"
				:sortDirection="sortColumn === 'total' ? sortDirection : 'none'"
				@table:sort="sort('total')"
			>
				Total
			</table-header>
		</template>
		<tr v-for="row in rows" :key="row.object.id">
			<table-cell>{{ row.object.id }}</table-cell>
			<table-cell :isRowHeader="true">{{ row.object.fullTitle.en }}</table-cell>
			<table-cell>{{ row.views }}</table-cell>
			<table-cell>{{ row.downloads }}</table-cell>
			<table-cell>
				<button @click="open(row)">{{ row.total }}</button>
			</table-cell>
		</tr>
	</pkp-table>
</template>

<script>
import PreviewTable from './PreviewTable.vue';
import articleStats from '../helpers/articleStats.js';

const directions = ['descending', 'ascending', 'none'];

export default {
	extends: PreviewTable,
	data() {
		return {
			sortColumn: '',
			sortDirection: directions[2],
		};
	},
	methods: {
		/**
		 * Sort the table
		 */
		sort(column) {
			if (column === this.sortColumn) {
				const i = directions.findIndex((dir) => dir === this.sortDirection);
				this.sortDirection =
					i + 1 === directions.length ? directions[0] : directions[i + 1];
			} else {
				this.sortColumn = column;
				this.sortDirection = directions[0];
			}
			this.$nextTick(this.reorder);
		},

		/**
		 * Sort the rows in the table by the total views
		 */
		reorder() {
			if (!this.sortDirection || this.sortDirection === 'none') {
				this.rows = articleStats.slice(0, 10);
			} else {
				this.rows = this.rows.sort((a, b) => {
					return this.sortDirection === 'ascending'
						? a[this.sortColumn] > b[this.sortColumn]
						: a[this.sortColumn] < b[this.sortColumn];
				});
			}
			this.$announcer.set('Sorted by ' + this.sortColumn);
		},
	},
};
</script>
