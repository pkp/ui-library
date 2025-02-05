<template>
	<PkpTable aria-label="Example for basic table">
		<TableHeader>
			<TableColumn>{{ t('userInvitation.roleTable.role') }}</TableColumn>
			<TableColumn>{{ t('userInvitation.roleTable.startDate') }}</TableColumn>
			<TableColumn>{{ t('userInvitation.roleTable.endDate') }}</TableColumn>
			<TableColumn>
				{{ t('userInvitation.roleTable.journalMasthead') }}
			</TableColumn>
			<TableColumn></TableColumn>
		</TableHeader>
		<TableBody>
			<TableRow v-for="(row, index) in userGroupsToAdd" :key="index">
				<TableCell :is-row-header="true">
					{{ row.userGroupName }}
				</TableCell>
				<TableCell>{{ formatShortDate(row.dateStart) }}</TableCell>
				<TableCell>
					{{ row.dateEnd ? formatShortDate(row.dateEnd) : '---' }}
				</TableCell>
				<TableCell>
					{{
						row.masthead
							? t('invitation.masthead.show')
							: t('invitation.masthead.hidden')
					}}
				</TableCell>
				<TableCell></TableCell>
			</TableRow>
		</TableBody>
	</PkpTable>
</template>

<script setup>
import {useLocalize} from '@/composables/useLocalize';
import PkpTable from '@/components/Table/Table.vue';
import TableCell from '@/components/Table/TableCell.vue';
import TableHeader from '@/components/Table/TableHeader.vue';
import TableColumn from '@/components/Table/TableColumn.vue';
import TableBody from '@/components/Table/TableBody.vue';
import TableRow from '@/components/Table/TableRow.vue';
import {defineProps} from 'vue';
import {useDate} from '@/composables/useDate';

defineProps({
	userGroupsToAdd: {type: Array, required: true},
});
const {t} = useLocalize();
const {formatShortDate} = useDate();
</script>
