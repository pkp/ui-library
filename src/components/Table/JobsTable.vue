<template>
	<pkp-table
		:columns="table_data.columns"
		:rows="table_data.rows"
		:description="table_data.description"
		:label="table_data.label"
	/>
</template>

<script>
import PkpTable from '@/components/Table/Table.vue';

export default {
	components: {
		PkpTable
	},
	props: ['table_data']
};
</script>
