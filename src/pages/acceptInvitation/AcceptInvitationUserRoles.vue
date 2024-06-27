<template>
	<PkpTable aria-label="Example for basic table">
		<TableHeader>
			<TableColumn>Title</TableColumn>
			<TableColumn>Start Date</TableColumn>
			<TableColumn>End Date</TableColumn>
			<TableColumn>Journal Masthead</TableColumn>
		</TableHeader>
		<TableBody>
			<TableRow v-for="(row, index) in rows" :key="index">
				<TableCell :is-row-header="true">
					{{ row.userGroupName }}
				</TableCell>
				<TableCell>{{ row.dateStart }}</TableCell>
				<TableCell>{{ row.dateEnd }}</TableCell>
				<TableCell>
					{{
						row.masthead
							? 'Appear on the masthead'
							: 'Dose not appear on the masthead'
					}}
				</TableCell>
			</TableRow>
		</TableBody>
	</PkpTable>
</template>

<script setup>
import PkpTable from '@/components/TableNext/Table.vue';
import TableCell from '@/components/TableNext/TableCell.vue';
import TableHeader from '@/components/TableNext/TableHeader.vue';
import TableColumn from '@/components/TableNext/TableColumn.vue';
import TableBody from '@/components/TableNext/TableBody.vue';
import TableRow from '@/components/TableNext/TableRow.vue';
import {defineProps} from 'vue';

defineProps({
	rows: {type: Array, required: true},
});
</script>
