<template>
	<div class="viewTable">
		<pkp-table
			:label="label"
			:description="description"
			:columns="columns"
			:rows="currentRows"
		/>
		<pagination
			:currentPage="currentPage"
			:lastPage="lastPage"
			:i18n="i18n"
			@setPage="setPage"
		/>
	</div>
</template>

<script>
import PkpTable from '@/components/Table/Table.vue';
import Pagination from '@/components/Pagination/Pagination.vue';
import ArticleStats from './helpers/ArticleStats.js';
import ArticleStatsColumns from './helpers/ArticleStatsColumns.js';

export default {
	components: {
		PkpTable,
		Pagination,
	},
	data: function () {
		return {
			label: 'Example With Pagination',
			description: 'Use the Pagination component to display large data sets in a table.',
			columns: ArticleStatsColumns,
			rows: ArticleStats,
			currentPage: 1,
			perPage: 5,
			i18n: {
				paginationLabel: 'Other pages of this example component',
				goToLabel: 'Go to {$page}',
				pageLabel: 'Page {$page}',
				nextPageLabel: 'Next page',
				previousPageLabel: 'Previous page',
			},
		};
	},
	computed: {
		lastPage: function () {
			return Math.floor(this.rows.length / this.perPage);
		},
		currentRows: function () {
			const start = (this.currentPage * this.perPage) - this.perPage;
			return this.rows.slice(start, (start + this.perPage));
		},
	},
	methods: {
		setPage: function (page) {
			this.currentPage = page;
		},
	},
};
</script>
