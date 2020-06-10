<template>
	<pkp-table
		label="Example Table"
		description="This example shows a table with a truncated column, so that the column content cuts off instead of wraps. You may need to reduce the width of your screen to see the effect."
		:columns="columns"
		:rows="rows"
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
				if (col.name === 'title') {
					col.truncate = 'medium';
				}
				return col;
			})
		};
	}
};
</script>
