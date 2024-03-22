<template>
	<PkpTable aria-label="Example for basic table">
		<TableHeader>
			<TableColumn>Title</TableColumn>
			<TableColumn>Start Date</TableColumn>
			<TableColumn>End Date</TableColumn>
			<TableColumn>Journal Masthead</TableColumn>
		</TableHeader>
		<TableBody>
			<TableRow v-for="(row, index) in section.rows" :key="index">
				<TableCell :is-row-header="true">
					{{ row.user_group_name }}
				</TableCell>
				<TableCell>{{ row.start_date }}</TableCell>
				<TableCell>{{ row.end_date }}</TableCell>
				<TableCell>tesing</TableCell>
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
	section: {type: Object, required: true},
});
</script>
