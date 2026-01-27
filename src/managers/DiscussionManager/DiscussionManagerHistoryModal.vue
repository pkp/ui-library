<template>
	<SideModalBody>
		<template #title>
			{{ t('common.history') }}
		</template>
		<template #post-description>
			<span>{{ workItem.title }}</span>
		</template>
		<SideModalLayoutBasic>
			<PkpTable>
				<TableHeader>
					<TableColumn>{{ t('common.event') }}</TableColumn>
				</TableHeader>
				<TableBody>
					<TableRow
						v-for="activity in workItem.latestActivities"
						:key="activity.id"
					>
						<TableCell>{{ activity.message }}</TableCell>
					</TableRow>
				</TableBody>
			</PkpTable>
		</SideModalLayoutBasic>
	</SideModalBody>
</template>
<script setup>
import {t} from '@/utils/i18n';

import SideModalBody from '@/components/Modal/SideModalBody.vue';
import SideModalLayoutBasic from '@/components/Modal/SideModalLayoutBasic.vue';
import PkpTable from '@/components/Table/Table.vue';
import TableHeader from '@/components/Table/TableHeader.vue';
import TableColumn from '@/components/Table/TableColumn.vue';
import TableBody from '@/components/Table/TableBody.vue';
import TableRow from '@/components/Table/TableRow.vue';
import TableCell from '@/components/Table/TableCell.vue';

defineProps({workItem: {type: Object, required: true}});
</script>
