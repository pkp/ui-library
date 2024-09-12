<template>
	<SideModalBody>
		<template #title>
			{{ t('common.download') }}
		</template>
		<SideModalLayoutBasic>
			<p>{{ t('stats.context.downloadReport.description') }}</p>
			<PkpTable>
				<TableRow>
					<TableCell :is-row-header="true">
						{{ t('stats.dateRange') }}
					</TableCell>
					<TableCell>{{ dateRangeDescription }}</TableCell>
				</TableRow>
			</PkpTable>
			<ActionPanel class="pkpStats__reportAction">
				<h2>{{ t('context.context') }}</h2>
				<p>
					{{ t('stats.context.downloadReport.downloadContext.description') }}
				</p>
				<template #actions>
					<PkpButton @click="() => emit('downloadReport', null)">
						{{ t('stats.context.downloadReport.downloadContext') }}
					</PkpButton>
				</template>
			</ActionPanel>
			<ActionPanel class="pkpStats__reportAction">
				<h2>{{ t('stats.timeline') }}</h2>
				<p>
					{{ timelineDescription }}
				</p>
				<template #actions>
					<PkpButton @click="() => emit('downloadReport', 'timeline')">
						{{ t('stats.timeline.downloadReport.downloadTimeline') }}
					</PkpButton>
				</template>
			</ActionPanel>
		</SideModalLayoutBasic>
	</SideModalBody>
</template>

<script setup>
import SideModalBody from '@/components/Modal/SideModalBody.vue';
import SideModalLayoutBasic from '@/components/Modal/SideModalLayoutBasic.vue';
import {useLocalize} from '@/composables/useLocalize';
import ActionPanel from '@/components/ActionPanel/ActionPanel.vue';
import PkpButton from '@/components/Button/Button.vue';
import PkpTable from '@/components/Table/Table.vue';
import TableRow from '@/components/Table/TableRow.vue';
import TableCell from '@/components/Table/TableCell.vue';

const {t} = useLocalize();
defineProps({
	dateRangeDescription: {type: String, required: true},
	timelineDescription: {type: String, required: true},
});
const emit = defineEmits(['downloadReport']);
</script>
