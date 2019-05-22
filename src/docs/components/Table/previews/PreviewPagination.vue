<template>
	<div class="previewTable">
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
			@set-page="setPage"
		/>
	</div>
</template>

<script>
import PkpTable from '@/components/Table/Table.vue';
import Pagination from '@/components/Pagination/Pagination.vue';
import {props} from '../config';
import articleStats from '../helpers/articleStats.js';

export default {
	components: {
		PkpTable,
		Pagination
	},
	data() {
		return {
			...props,
			description:
				'Use the Pagination component to display large data sets in a table.',
			currentPage: 1,
			isLoading: false,
			perPage: 10,
			rows: articleStats,
			i18n: {
				paginationLabel: 'Other pages of this example component',
				goToLabel: 'Go to {$page}',
				pageLabel: 'Page {$page}',
				nextPageLabel: 'Next page',
				previousPageLabel: 'Previous page'
			}
		};
	},
	computed: {
		lastPage: function() {
			return Math.floor(this.rows.length / this.perPage);
		},
		currentRows: function() {
			const start = this.currentPage * this.perPage - this.perPage;
			return this.rows.slice(start, start + this.perPage);
		}
	},
	methods: {
		setPage: function(page) {
			this.currentPage = page;
		}
	}
};
</script>
