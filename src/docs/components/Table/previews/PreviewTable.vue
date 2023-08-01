<template>
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
		<tr v-for="row in rows" :key="row.object.id">
			<table-cell>{{ row.object.id }}</table-cell>
			<table-cell :isRowHeader="true">{{ row.object.fullTitle.en }}</table-cell>
			<table-cell>{{ row.views }}</table-cell>
			<table-cell>{{ row.downloads }}</table-cell>
			<table-cell>
				<button @click="open(row)">{{ row.total }}</button>
			</table-cell>
		</tr>
	</pkp-table>
</template>

<script>
import PkpTable from '../../../../components/TableNext/Table.vue';
import articleStats from '../helpers/articleStats.js';
import TableHeader from '../../../../components/TableNext/TableHeader.vue';
import TableCell from '../../../../components/TableNext/TableCell.vue';
import dialog from '../../../../mixins/dialog';

export default {
	components: {
		PkpTable,
		TableCell,
		TableHeader,
	},
	mixins: [dialog],
	data() {
		return {
			rows: articleStats.slice(0, 10),
		};
	},
	methods: {
		open(row) {
			this.openDialog({
				name: 'example',
				title: 'Row Data',
				message: JSON.stringify(row),
				actions: [
					{
						label: 'Ok',
						callback: () => {
							this.$modal.hide('example');
						},
					},
				],
			});
		},
	},
};
</script>
