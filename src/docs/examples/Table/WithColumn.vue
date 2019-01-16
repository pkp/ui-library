<template>
	<div class="viewTable">
		<pkp-table
			:caption="caption"
			:orderBy="orderBy"
			:orderDirection="orderDirection"
			:columns="columns"
			:rows="rows"
		>
			<tbody slot="rows">
				<table-row v-for="(row, rowIndex) in rows" :key="'row' + rowIndex">
					<table-cell
						v-for="(column, columnIndex) in columns"
						:key="column.name"
						:column="column"
						:row="row"
					>
						<pkp-button
							v-if="column.name === 'pdf'"
							:label="row.pdf.toString()"
							@click="viewItem(row)"
						/>
					</table-cell>
				</table-row>
			</tbody>
		</pkp-table>
	</div>
</template>

<script>
import PkpButton from '@/components/Button/Button.vue';
import PkpTable from '@/components/Table/Table.vue';
import TableRow from '@/components/Table/TableRow.vue';
import TableCell from '@/components/Table/TableCell.vue';
import ArticleStats from './helpers/ArticleStats.js';

export default {
	components: {
		PkpButton,
		PkpTable,
		TableRow,
		TableCell,
	},
	data: function () {
		return {
			caption: 'Example table with a custom column template',
			orderBy: '',
			orderDirection: false,
			columns: [
				{
					name: 'views',
					label: 'Views',
					value: 'views',
				},
				{
					name: 'downloads',
					label: 'Downloads',
					value: 'downloads',
				},
				{
					name: 'pdf',
					label: 'PDF',
					value: 'pdf',
				},
				{
					name: 'html',
					label: 'HTML',
					value: 'html',
				},
				{
					name: 'other',
					label: 'Other',
					value: 'other',
				},
				{
					name: 'total',
					label: 'Total',
					value: 'total',
				},
			],
			rows: ArticleStats,
		};
	},
	methods: {
		viewItem: function (row) {
			alert(JSON.stringify(row));
		},
	},
};
</script>
