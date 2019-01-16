<template>
	<div class="viewTable">
		<pkp-table
			:caption="caption"
			:orderBy="orderBy"
			:orderDirection="orderDirection"
			:columns="columns"
			:rows="rows"
		/>
	</div>
</template>

<script>
import PkpTable from '@/components/Table/Table.vue';
import ArticleStats from './helpers/ArticleStats.js';

export default {
	components: {
		PkpTable,
	},
	data: function () {
		return {
			caption: 'Example Table',
			orderBy: '',
			orderDirection: false,
			columns: [
				{
					name: 'id',
					label: 'ID',
					value (row) { return row.object.id; },
				},
				{
					name: 'title',
					label: 'Title',
					isRowHeader: true,
					truncate: 'medium',
					value (row) { return row.object.fullTitle.en_US; },
					orderBy: 'title',
					initialOrderDirection: false,
				},
				{
					name: 'author',
					label: 'Contributors',
					value (row) { return row.object.authorString; },
				},
				{
					name: 'views',
					label: 'Views',
					value: 'views',
				},
				{
					name: 'downloads',
					label: 'Downloads',
					value: 'downloads',
				},
				{
					name: 'pdf',
					label: 'PDF',
					value: 'pdf',
				},
				{
					name: 'html',
					label: 'HTML',
					value: 'html',
				},
				{
					name: 'other',
					label: 'Other',
					value: 'other',
				},
				{
					name: 'total',
					label: 'Total',
					value: 'total',
				},
			],
			rows: ArticleStats,
		};
	},
};
</script>
