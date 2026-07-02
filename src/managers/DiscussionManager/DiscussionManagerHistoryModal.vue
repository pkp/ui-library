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
					<TableColumn>{{ t('common.date') }}</TableColumn>
					<TableColumn>{{ t('common.user') }}</TableColumn>
					<TableColumn>{{ t('common.event') }}</TableColumn>
					<TableColumn>
						<span class="sr-only">{{ t('common.download') }}</span>
					</TableColumn>
				</TableHeader>
				<TableBody>
					<TableRow
						v-for="activity in workItem.latestActivities"
						:key="activity.id"
					>
						<TableCell>
							{{ formatShortDate(activity.date) }}
						</TableCell>
						<TableCell>{{ activity.userFullName }}</TableCell>
						<TableCell>
							<span class="whitespace-normal [overflow-wrap:anywhere]">
								{{ activity.message }}
							</span>
						</TableCell>
						<TableCell>
							<div class="flex justify-end">
								<PkpButton
									v-if="activity.settings?.downloadUrl"
									element="a"
									is-link
									:href="activity.settings.downloadUrl"
								>
									{{ t('common.download') }}
								</PkpButton>
							</div>
						</TableCell>
					</TableRow>
				</TableBody>
			</PkpTable>
		</SideModalLayoutBasic>
	</SideModalBody>
</template>
<script setup>
import {t} from '@/utils/i18n';
import {useDate} from '@/composables/useDate';

import SideModalBody from '@/components/Modal/SideModalBody.vue';
import SideModalLayoutBasic from '@/components/Modal/SideModalLayoutBasic.vue';
import PkpTable from '@/components/Table/Table.vue';
import TableHeader from '@/components/Table/TableHeader.vue';
import TableColumn from '@/components/Table/TableColumn.vue';
import TableBody from '@/components/Table/TableBody.vue';
import TableRow from '@/components/Table/TableRow.vue';
import TableCell from '@/components/Table/TableCell.vue';
import PkpButton from '@/components/Button/Button.vue';

const {formatShortDate} = useDate();

defineProps({workItem: {type: Object, required: true}});
</script>
