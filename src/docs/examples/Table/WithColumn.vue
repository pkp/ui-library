<template>
	<div class="viewTable">
		<pkp-table
			:label="label"
			:description="description"
			:columns="columns"
			:rows="rows"
		>
			<template slot="rows">
				<table-row v-for="(row, rowIndex) in rows" :key="'row' + rowIndex">
					<table-cell
						v-for="(column, columnIndex) in columns"
						:key="column.name"
						:column="column"
						:row="row"
						:tabindex="!rowIndex && !columnIndex ? 0 : -1"
					>
						<pkp-button
							v-if="column.name === 'pdf'"
							:label="row.pdf.toString()"
							@click="viewItem(row)"
						/>
					</table-cell>
				</table-row>
			</template>
		</pkp-table>
	</div>
</template>

<script>
import PkpButton from '@/components/Button/Button.vue';
import PkpTable from '@/components/Table/Table.vue';
import TableRow from '@/components/Table/TableRow.vue';
import TableCell from '@/components/Table/TableCell.vue';
import ArticleStats from './helpers/ArticleStats.js';
import ArticleStatsColumns from './helpers/ArticleStatsColumns.js';

export default {
	components: {
		PkpButton,
		PkpTable,
		TableRow,
		TableCell,
	},
	data: function () {
		return {
			label: 'Example Custom Column',
			description: 'This table uses the <code>rows</code> slot to customize the output of one cell in each row.',
			columns: ArticleStatsColumns.slice(3),
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
