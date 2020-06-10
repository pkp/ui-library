<template>
	<pkp-table
		label="Example Table"
		description="This example supports sorting by the abstract, galley and total views columns."
		:columns="columns"
		:rows="rows"
		:order-by="orderBy"
		:order-direction="orderDirection"
		@order-by="setOrder"
	/>
</template>

<script>
import PreviewTable from './PreviewTable.vue';
import articleStatsColumns from '../helpers/articleStatsColumns.js';

export default {
	extends: PreviewTable,
	data() {
		return {
			columns: articleStatsColumns.map(col => {
				if (['abstractViews', 'galleyViews', 'total'].includes(col.name)) {
					col.orderBy = col.name;
					col.initialOrderDirection = true;
				}
				return col;
			}),
			orderBy: '',
			orderDirection: false
		};
	},
	methods: {
		/**
		 * Update the orderBy and orderDirection values
		 *
		 * @param string orderBy The column to sort by
		 * @param boolean orderDirection
		 */
		setOrder(orderBy, orderDirection) {
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
		reorder(orderBy, orderDirection) {
			const orderByColumn = this.columns.find(col => col.name === orderBy);
			if (!orderByColumn) {
				return;
			}
			this.rows = this.rows.sort((a, b) => {
				return a[orderBy] > b[orderBy]
					? orderDirection
						? -1
						: 1
					: orderDirection
					? 1
					: -1;
			});
		}
	},
	watch: {
		orderBy(newVal, oldVal) {
			if (newVal === oldVal) {
				return;
			}
			this.reorder(newVal, this.orderDirection);
		},
		orderDirection(newVal, oldVal) {
			if (newVal === oldVal) {
				return;
			}
			this.reorder(this.orderBy, newVal);
		}
	}
};
</script>
