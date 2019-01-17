<template>
	<div class="viewTable">
		<pkp-table
			:label="label"
			:description="description"
			:columns="columns"
			:rows="rows"
			:orderBy="orderBy"
			:orderDirection="orderDirection"
			@orderBy="setOrder"
		/>
	</div>
</template>

<script>
import PkpTable from '@/components/Table/Table.vue';
import ArticleStats from './helpers/ArticleStats.js';
import ArticleStatsColumns from './helpers/ArticleStatsColumns.js';

export default {
	components: {
		PkpTable,
	},
	data: function () {
		const sortableColumns = ArticleStatsColumns.map(col => {
			if (['views', 'downloads', 'total'].includes(col.name)) {
				col.orderBy = col.name;
				col.initialOrderDirection = true;
			}
			return col;
		});
		return {
			label: 'Example With Sorting',
			description: 'This example allows the user to sort entries by the title. See the section on Sorting in the usage guidance below.',
			columns: sortableColumns,
			rows: ArticleStats,
			orderBy: '',
			orderDirection: false,
		};
	},
	methods: {
		/**
		 * Update the orderBy and orderDirection values
		 *
		 * @param string orderBy The column to sort by
		 * @param boolean orderDirection
		 */
		setOrder: function (orderBy, orderDirection) {
			this.orderBy = orderBy;
			this.orderDirection = orderDirection;
		},

		/**
		 * Sort the rows in table when an orderBy event is emitted from the table
		 *
		 * If there are more rows available than are displayed in the table, you
		 * should make a request to the server to sort the items. For this example,
		 * we will sort in the browser.
		 *
		 * @param string orderBy The column to sort by
		 * @param boolean orderDirection
		 */
		reorder: function (orderBy, orderDirection) {
			const orderByColumn = this.columns.find(col => col.name === orderBy);
			if (!orderByColumn) {
				return;
			}

			this.rows = this.rows.sort((a, b) => {
				return a[orderBy] > b[orderBy]
					? (orderDirection ? -1 : 1)
					: (orderDirection ? 1 : -1);
			});
		},
	},
	watch: {
		orderBy: function (newVal, oldVal) {
			if (newVal === oldVal) {
				return;
			}
			this.reorder(newVal, this.orderDirection);
		},
		orderDirection: function (newVal, oldVal) {
			if (newVal === oldVal) {
				return;
			}
			this.reorder(this.orderBy, newVal);
		},
	},
};
</script>
