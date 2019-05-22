<template>
	<div class="previewTable">
		<pkp-table v-bind="table" />
	</div>
</template>

<script>
import PkpTable from '@/components/Table/Table.vue';
import {props} from '../config';

export default {
	components: {
		PkpTable
	},
	data() {
		const truncatedColumns = props.columns.map(col => {
			if (col.name === 'title') {
				col.truncate = 'medium';
			}
			return col;
		});
		return {
			table: {
				...props,
				description:
					'This example shows a table with a truncated column, so that the column content cuts off instead of wraps. You may need to reduce the width of your screen to see the effect.',
				columns: truncatedColumns
			}
		};
	}
};
</script>
