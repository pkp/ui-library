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
					scope="col"
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
import articleStats from './helpers/articleStats.js';
import articleStatsColumns from './helpers/articleStatsColumns.js';

export default {
	components: {
		Icon,
		PkpTable,
	},
	data: function () {
		return {
			label: 'Example Custom Header',
			description: 'This table uses the <code>header</code> slot to customize the PDF column header.',
			columns: articleStatsColumns.slice(3),
			rows: articleStats.slice(0, 10),
		};
	},
};
</script>
