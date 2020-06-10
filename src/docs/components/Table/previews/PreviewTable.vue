<template>
	<pkp-table label="Example Table" :columns="columns" :rows="rows" />
</template>

<script>
import PkpTable from '@/components/Table/Table.vue';
import articleStats from '../helpers/articleStats.js';
import articleStatsColumns from '../helpers/articleStatsColumns.js';

export default {
	components: {
		PkpTable
	},
	data() {
		return {
			columns: [...articleStatsColumns],
			rows: articleStats.slice(0, 10)
		};
	}
};
</script>
