<template>
	<div class="previewTable">
		<pkp-table>
			<pkp-header slot="caption">
				<h2>Example Table</h2>
			</pkp-header>
			<template slot="head">
				<table-header>ID</table-header>
				<table-header>Title</table-header>
				<table-header>Views</table-header>
				<table-header>Downloads</table-header>
				<table-header>Total</table-header>
			</template>
			<tr v-for="row in currentRows" :key="row.object.id">
				<table-cell>{{ row.object.id }}</table-cell>
				<table-cell :isRowHeader="true">
					{{ row.object.fullTitle.en }}
				</table-cell>
				<table-cell>{{ row.views }}</table-cell>
				<table-cell>{{ row.downloads }}</table-cell>
				<table-cell>
					<button @click="open(row)">{{ row.total }}</button>
				</table-cell>
			</tr>
		</pkp-table>
		<button-row>
			<pagination
				:currentPage="currentPage"
				:lastPage="lastPage"
				@set-page="setPage"
			/>
		</button-row>
	</div>
</template>

<script>
import PreviewTable from './PreviewTable.vue';
import Pagination from '@/components/Pagination/Pagination.vue';
import articleStats from '../helpers/articleStats.js';
import ButtonRow from '../../../../components/ButtonRow/ButtonRow.vue';

export default {
	extends: PreviewTable,
	components: {
		ButtonRow,
		Pagination,
	},
	data() {
		return {
			currentPage: 1,
			isLoading: false,
			perPage: 10,
			rows: [...articleStats],
		};
	},
	computed: {
		lastPage: function () {
			return Math.floor(this.rows.length / this.perPage);
		},
		currentRows: function () {
			const start = this.currentPage * this.perPage - this.perPage;
			return this.rows.slice(start, start + this.perPage);
		},
	},
	methods: {
		setPage: function (page) {
			this.currentPage = page;
		},
	},
};
</script>
