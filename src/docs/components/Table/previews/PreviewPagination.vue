<template>
	<div class="previewTable">
		<pkp-table
			label="Example Table"
			description="Use the Pagination component to display large data sets in a table."
			:columns="columns"
			:rows="currentRows"
		/>
		<pagination
			:currentPage="currentPage"
			:lastPage="lastPage"
			@set-page="setPage"
		/>
	</div>
</template>

<script>
import PreviewTable from './PreviewTable.vue';
import Pagination from '@/components/Pagination/Pagination.vue';
import articleStats from '../helpers/articleStats.js';

export default {
	extends: PreviewTable,
	components: {
		Pagination
	},
	data() {
		return {
			currentPage: 1,
			isLoading: false,
			perPage: 10,
			rows: [...articleStats]
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
