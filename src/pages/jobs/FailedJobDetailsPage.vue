<template>
	<PkpTable>
		<template v-if="label" #label>
			<span v-strip-unsafe-html="label"></span>
		</template>
		<TableHeader>
			<TableColumn
				v-for="column in columns"
				:id="column.name"
				:key="column.name"
			>
				{{ column.label }}
			</TableColumn>
		</TableHeader>
		<TableBody>
			<TableRow v-for="row in rows" :key="row.key">
				<TableCell>{{ row.attribute }}</TableCell>
				<TableCell>
					<span>
						<pre>{{ row.value }}</pre>
					</span>
				</TableCell>
			</TableRow>
		</TableBody>
	</PkpTable>
</template>

<script>
import PkpTable from '@/components/Table/Table.vue';
import TableCell from '@/components/Table/TableCell.vue';
import TableColumn from '@/components/Table/TableColumn.vue';
import TableHeader from '@/components/Table/TableHeader.vue';
import TableBody from '@/components/Table/TableBody.vue';
import TableRow from '@/components/Table/TableRow.vue';

export default {
	name: 'FailedJobDetailsPage',
	components: {
		PkpTable,
		TableCell,
		TableColumn,
		TableHeader,
		TableBody,
		TableRow,
	},
	props: {
		label: {
			type: String,
			default: '',
		},
		columns: {
			type: Array,
			default: () => [],
		},
		rows: {
			type: Array,
			default: () => [],
		},
	},
};
</script>
