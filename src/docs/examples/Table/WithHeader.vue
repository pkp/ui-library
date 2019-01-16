<template>
	<div class="viewTable viewTable--withRow">
		<pkp-table
			:caption="caption"
			:columns="columns"
			:rows="rows"
		>
			<template slot="header">
				<th v-for="column in columns"
					:key="column.name"
					:scope="column.scope ? column.scope : 'col'"
				>
					{{ column.label }}
					<icon v-if="column.name === 'pdf'" icon="exclamation-triangle" />
				</th>
			</template>
		</pkp-table>
	</div>
</template>

<script>
import Icon from '@/components/Icon/Icon.vue';
import PkpTable from '@/components/Table/Table.vue';
import ArticleStats from './helpers/ArticleStats.js';

export default {
	components: {
		Icon,
		PkpTable,
	},
	data: function () {
		return {
			caption: 'Example table with a custom header template',
			columns: [
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
