<template>
	<PkpTable>
		<template v-if="label" #label>
			<span v-html="label"></span>
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
import PkpTable from '@/components/TableNext/Table.vue';
import TableCell from '@/components/TableNext/TableCell.vue';
import TableColumn from '@/components/TableNext/TableColumn.vue';
import TableHeader from '@/components/TableNext/TableHeader.vue';
import TableBody from '@/components/TableNext/TableBody.vue';
import TableRow from '@/components/TableNext/TableRow.vue';

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
