<template>
	<SideModalBody>
		<template #title>
			{{ t('manager.dois.help.statuses.title') }}
		</template>
		<SideModalLayoutBasic>
			<PkpTable>
				<TableHeader>
					<TableColumn>{{ t('common.status') }}</TableColumn>
					<TableColumn>{{ t('common.description') }}</TableColumn>
				</TableHeader>
				<TableRow>
					<TableCell :is-row-header="true">
						{{ t('manager.dois.status.needsDoi') }}
					</TableCell>
					<TableCell>
						{{ t('manager.dois.status.needsDoi.description') }}
					</TableCell>
				</TableRow>
				<TableRow>
					<TableCell :is-row-header="true">
						{{ t('manager.dois.filters.doiAssigned') }}
					</TableCell>
					<TableCell>
						{{ t('manager.dois.filters.doiAssigned.description') }}
					</TableCell>
				</TableRow>
				<TableRow>
					<TableCell :is-row-header="true">
						{{ t('manager.dois.status.unregistered') }}
					</TableCell>
					<TableCell>
						{{ t('manager.dois.status.unregistered.description') }}
					</TableCell>
				</TableRow>
				<TableRow>
					<TableCell :is-row-header="true">
						{{ t('manager.dois.status.submitted') }}
					</TableCell>
					<TableCell>
						{{ t('manager.dois.status.submitted.description') }}
					</TableCell>
				</TableRow>
				<TableRow>
					<TableCell :is-row-header="true">
						{{ t('manager.dois.status.registered') }}
					</TableCell>
					<TableCell>
						{{ t('manager.dois.status.registered.description') }}
					</TableCell>
				</TableRow>
				<TableRow>
					<TableCell :is-row-header="true">
						{{ t('manager.dois.status.error.filterTitle') }}
					</TableCell>
					<TableCell>
						{{ t('manager.dois.status.error.description') }}
					</TableCell>
				</TableRow>
				<TableRow>
					<TableCell :is-row-header="true">
						{{ t('manager.dois.status.stale') }}
					</TableCell>
					<TableCell>
						{{ t('manager.dois.status.stale.description') }}
					</TableCell>
				</TableRow>
			</PkpTable>
		</SideModalLayoutBasic>
	</SideModalBody>
</template>

<script setup>
import SideModalBody from '@/components/Modal/SideModalBody.vue';
import SideModalLayoutBasic from '@/components/Modal/SideModalLayoutBasic.vue';
import {useLocalize} from '@/composables/useLocalize';
import PkpTable from '@/components/Table/Table.vue';
import TableHeader from '@/components/Table/TableHeader.vue';
import TableColumn from '@/components/Table/TableColumn.vue';
import TableRow from '@/components/Table/TableRow.vue';
import TableCell from '@/components/Table/TableCell.vue';

const {t} = useLocalize();
</script>
