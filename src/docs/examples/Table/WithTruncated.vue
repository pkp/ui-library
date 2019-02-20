<template>
	<div class="viewTable">
		<pkp-table
			:label="label"
			:description="description"
			:columns="columns"
			:rows="rows"
		/>
	</div>
</template>

<script>
import PkpTable from '@/components/Table/Table.vue';
import articleStats from './helpers/articleStats.js';
import articleStatsColumns from './helpers/articleStatsColumns.js';

export default {
	components: {
		PkpTable,
	},
	data: function () {
		const truncatedColumn = articleStatsColumns.map(col => {
			if (col.name === 'title') {
				col.truncate = 'medium';
			}
			return col;
		});
		return {
			label: 'Example With Truncated Column',
			description: 'This example shows a table with a truncated column, so that the column content cuts off instead of wraps. You may need to reduce the width of your screen to see the effect.',
			columns: truncatedColumn,
			rows: articleStats.slice(0, 10),
		};
	},
};
</script>
