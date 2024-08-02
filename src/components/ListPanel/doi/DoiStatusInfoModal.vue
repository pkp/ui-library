<template>
	<SideModalBody>
		<template #title>
			{{ t('manager.dois.help.statuses.title') }}
		</template>
		<SideModalLayoutBasic>
			<table class="pkpTable">
				<thead>
					<tr>
						<th>{{ t('common.status') }}</th>
						<th>{{ t('common.description') }}</th>
					</tr>
				</thead>
				<tr class="pkpTable__row">
					<th>{{ t('manager.dois.status.needsDoi') }}</th>
					<td>{{ t('manager.dois.status.needsDoi.description') }}</td>
				</tr>
				<tr class="pkpTable__row">
					<th>{{ t('manager.dois.filters.doiAssigned') }}</th>
					<td>{{ t('manager.dois.filters.doiAssigned.description') }}</td>
				</tr>
				<tr class="pkpTable__row">
					<th>{{ t('manager.dois.status.unregistered') }}</th>
					<td>{{ t('manager.dois.status.unregistered.description') }}</td>
				</tr>
				<tr class="pkpTable__row">
					<th>{{ t('manager.dois.status.submitted') }}</th>
					<td>{{ t('manager.dois.status.submitted.description') }}</td>
				</tr>
				<tr class="pkpTable__row">
					<th>{{ t('manager.dois.status.registered') }}</th>
					<td>{{ t('manager.dois.status.registered.description') }}</td>
				</tr>
				<tr class="pkpTable__row">
					<th>{{ t('manager.dois.status.error.filterTitle') }}</th>
					<td>{{ t('manager.dois.status.error.description') }}</td>
				</tr>
				<tr class="pkpTable__row">
					<th>{{ t('manager.dois.status.stale') }}</th>
					<td>{{ t('manager.dois.status.stale.description') }}</td>
				</tr>
			</table>
		</SideModalLayoutBasic>
	</SideModalBody>
</template>

<script setup>
import SideModalBody from '@/components/Modal/SideModalBody.vue';
import SideModalLayoutBasic from '@/components/Modal/SideModalLayoutBasic.vue';
import {useLocalize} from '@/composables/useLocalize';

const {t} = useLocalize();
</script>
