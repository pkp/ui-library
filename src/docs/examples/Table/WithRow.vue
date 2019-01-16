<template>
	<div class="viewTable viewTable--withRow">
		<pkp-table
			:caption="caption"
			:orderBy="orderBy"
			:orderDirection="orderDirection"
			:columns="columns"
			:rows="rows"
		>
			<template slot="row" slot-scope="{ row, getCellClasses }">
				<td :class="getCellClasses(row, columns[0])">
					<pkp-button	:label="'View'" @click="viewItem(row)" />
				</td>
				<th scope="row" :class="getCellClasses(row, columns[1])">
					<div class="viewTable--withRow__submission">
						<div class="viewTable--withRow__submission__authors">
							{{ row.object.authorString }}
						</div>
						<div class="viewTable--withRow__submission__title">
							{{ row.object.fullTitle.en_US}}
						</div>
					</div>
				</th>
				<td :class="getCellClasses(row, columns[2])">{{ row.views }}</td>
				<td :class="getCellClasses(row, columns[3])">{{ row.downloads }}</td>
				<td :class="getCellClasses(row, columns[4])">{{ row.pdf }}</td>
				<td :class="getCellClasses(row, columns[5])">{{ row.html }}</td>
				<td :class="getCellClasses(row, columns[6])">{{ row.other }}</td>
				<td :class="getCellClasses(row, columns[7])">{{ row.total }}</td>
			</template>
		</pkp-table>
	</div>
</template>

<script>
import PkpButton from '@/components/Button/Button.vue';
import PkpTable from '@/components/Table/Table.vue';
import ArticleStats from './helpers/ArticleStats.js';

export default {
	components: {
		PkpButton,
		PkpTable,
	},
	methods: {
		viewItem: function (row) {
			alert(JSON.stringify(row));
		},
	},
	data: function () {
		return {
			caption: 'Example table with a custom row template',
			orderBy: '',
			orderDirection: false,
			columns: [
				{
					name: 'id',
					label: 'ID',
				},
				{
					name: 'title',
					label: 'Title',
					isRowHeader: true,
					truncate: 'medium',
					orderBy: 'title',
					initialOrderDirection: false,
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

<style lang="less">
@import '../../../styles/_import';

.viewTable--withRow__submission {
	font-size: @font-tiny;
}

.viewTable--withRow__submission__authors {
	font-weight: @bold;
}
</style>
