<template>
	<div class="viewTable">
		<pkp-table
			:label="label"
			:description="description"
			:columns="columns"
			:rows="rows"
		>
			<tr slot="header">
				<th v-for="column in columns"
					:key="column.name"
					:scope="column.scope ? column.scope : 'col'"
				>
					{{ column.label }}
					<icon v-if="column.name === 'pdf'" icon="exclamation-triangle" />
				</th>
			</tr>
		</pkp-table>
	</div>
</template>

<script>
import Icon from '@/components/Icon/Icon.vue';
import PkpTable from '@/components/Table/Table.vue';
import ArticleStats from './helpers/ArticleStats.js';
import ArticleStatsColumns from './helpers/ArticleStatsColumns.js';

export default {
	components: {
		Icon,
		PkpTable,
	},
	data: function () {
		return {
			label: 'Example Custom Header',
			description: 'This table uses the <code>header</code> slot to customize the PDF column header.',
			columns: ArticleStatsColumns.slice(3),
			rows: ArticleStats.slice(0, 10),
		};
	},
};
</script>
