<template>
	<div class="viewTable">
		<pkp-table
			:label="label"
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
			columns: ArticleStatsColumns,
			rows: ArticleStats.slice(0, 10),
		};
	},
};
</script>
