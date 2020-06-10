<template>
	<pkp-table
		label="Example Table"
		description="This table uses the <code>rows</code> slot to customize the output of the PDF column in each row."
		:columns="columns"
		:rows="rows"
	>
		<template slot-scope="{row, rowIndex}">
			<table-cell
				v-for="(column, columnIndex) in columns"
				:key="column.name"
				:column="column"
				:row="row"
				:tabindex="!rowIndex && !columnIndex ? 0 : -1"
			>
				<pkp-button v-if="column.name === 'pdf'" @click="viewItem(row)">
					{{ row.pdf.toString() }}
				</pkp-button>
			</table-cell>
		</template>
	</pkp-table>
</template>

<script>
import PreviewTable from './PreviewTable.vue';
import TableCell from '@/components/Table/TableCell.vue';

export default {
	extends: PreviewTable,
	components: {
		TableCell
	},
	methods: {
		viewItem: function(row) {
			alert(JSON.stringify(row));
		}
	}
};
</script>
