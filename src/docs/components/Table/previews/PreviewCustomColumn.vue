<template>
	<div class="previewTable">
		<pkp-table v-bind="table">
			<template slot-scope="{row, rowIndex}">
				<table-cell
					v-for="(column, columnIndex) in table.columns"
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
			</template>
		</pkp-table>
	</div>
</template>

<script>
import PkpTable from '@/components/Table/Table.vue';
import TableCell from '@/components/Table/TableCell.vue';
import PkpButton from '@/components/Button/Button.vue';
import {props} from '../config';

export default {
	components: {
		PkpTable,
		TableCell,
		PkpButton
	},
	data() {
		return {
			table: {
				...props,
				description:
					'This table uses the <code>rows</code> slot to customize the output of the PDF column in each row.',
				rows: props.rows.slice(0, 10)
			}
		};
	},
	methods: {
		viewItem: function(row) {
			alert(JSON.stringify(row));
		}
	}
};
</script>
