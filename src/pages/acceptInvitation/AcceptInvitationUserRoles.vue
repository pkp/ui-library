<template>
	<PkpTable aria-label="Example for basic table">
		<TableHeader>
			<TableColumn>{{ t('userInvitation.roleTable.role') }}</TableColumn>
			<TableColumn>{{ t('userInvitation.roleTable.startDate') }}</TableColumn>
			<TableColumn>{{ t('userInvitation.roleTable.endDate') }}</TableColumn>
			<TableColumn>
				{{ t('userInvitation.roleTable.journalMasthead') }}
			</TableColumn>
		</TableHeader>
		<TableBody>
			<TableRow v-for="(row, index) in rows" :key="index">
				<TableCell :is-row-header="true">
					{{ row.userGroupName }}
				</TableCell>
				<TableCell>{{ row.dateStart }}</TableCell>
				<TableCell>{{ row.dateEnd ? row.dateEnd : '---' }}</TableCell>
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
import {useTranslation} from '@/composables/useTranslation';
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
const {t} = useTranslation();
</script>
