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
import articleStats from './helpers/articleStats.js';
import articleStatsColumns from './helpers/articleStatsColumns.js';

export default {
	components: {
		PkpTable,
	},
	data: function () {
		return {
			label: 'Example Table',
			description: '',
			labelledBy: '',
			describedBy: '',
			columns: articleStatsColumns,
			rows: articleStats.slice(0, 10),
			orderBy: '',
			orderDirection: false,
		};
	},
};
</script>
