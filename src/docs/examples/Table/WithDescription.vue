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
import ArticleStats from './helpers/ArticleStats.js';
import ArticleStatsColumns from './helpers/ArticleStatsColumns.js';

export default {
	components: {
		PkpTable,
	},
	data: function () {
		return {
			label: 'Example Table',
			description: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
			columns: ArticleStatsColumns,
			rows: ArticleStats.slice(0, 10),
		};
	},
};
</script>
