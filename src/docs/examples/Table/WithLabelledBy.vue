<template>
	<div class="viewTable">
		<h1 id="viewTableLabel">
			Example Using <code>labelledBy</code> and <code>describedBy</code>
		</h1>
		<p id="viewTableDescription">
			You can use the <code>labelledBy</code>	and <code>describedBy</code>
			props to label the table with other HTML elements. See the Labelling
			section in the usage guidance below.
		</p>
		<pkp-table
			labelledBy="viewTableLabel"
			describedBy="viewTableDescription"
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
			columns: ArticleStatsColumns,
			rows: ArticleStats.slice(0, 10),
		};
	},
};
</script>
