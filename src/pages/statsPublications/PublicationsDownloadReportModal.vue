<template>
	<SideModalBody>
		<template #title>
			{{ t('common.download') }}
		</template>
		<SideModalLayoutBasic>
			<p>{{ t('stats.publications.downloadReport.description') }}</p>
			<PkpTable>
				<TableRow>
					<TableCell :is-row-header="true">
						{{ t('stats.dateRange') }}
					</TableCell>
					<TableCell>{{ dateRangeDescription }}</TableCell>
				</TableRow>
				<TableRow v-for="(filterSet, index) in filters" :key="index">
					<TableCell :is-row-header="true">
						{{ filterSet.heading }}
					</TableCell>
					<TableCell>{{ getFilterDescription(filterSet) }}</TableCell>
				</TableRow>
				<TableRow v-if="searchPhrase">
					<TableCell :is-row-header="true">
						{{ t('common.searchPhrase') }}
					</TableCell>
					<TableCell>{{ searchPhrase }}</TableCell>
				</TableRow>
			</PkpTable>
			<ActionPanel class="pkpStats__reportAction">
				<h2>{{ t('common.publications') }}</h2>
				<p>
					{{
						t(
							'stats.publications.downloadReport.downloadSubmissions.description',
						)
					}}
				</p>
				<template #actions>
					<PkpButton @click="() => emit('downloadReport', null)">
						{{ t('stats.publications.downloadReport.downloadSubmissions') }}
					</PkpButton>
				</template>
			</ActionPanel>
			<ActionPanel class="pkpStats__reportAction">
				<h2>{{ t('submission.files') }}</h2>
				<p>
					{{ t('stats.publications.downloadReport.downloadFiles.description') }}
				</p>
				<template #actions>
					<PkpButton @click="() => emit('downloadReport', 'files')">
						{{ t('stats.publications.downloadReport.downloadFiles') }}
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
			<ActionPanel v-if="geoReportType" class="pkpStats__reportAction">
				<h2>
					<span class="align-middle">{{ t('common.geographic') }}</span>
					<Tooltip
						:tooltip="t('stats.geographic.ccAttribution')"
						:label="t('stats.geographic.tooltip.label')"
					></Tooltip>
				</h2>
				<p>
					{{
						t(
							'stats.publications.downloadReport.downloadGeographic.description',
						)
					}}
				</p>
				<template #actions>
					<PkpButton @click="() => emit('downloadReport', geoReportType)">
						{{ t('stats.publications.downloadReport.downloadGeographic') }}
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
import Tooltip from '@/components/Tooltip/Tooltip.vue';
import PkpTable from '@/components/Table/Table.vue';
import TableRow from '@/components/Table/TableRow.vue';
import TableCell from '@/components/Table/TableCell.vue';

const {t} = useLocalize();
defineProps({
	searchPhrase: {type: String, required: false, default: ''},
	dateRangeDescription: {type: String, required: true},
	timelineDescription: {type: String, required: true},
	geoReportType: {type: String, required: false, default: null},
	getFilterDescription: {type: Function, required: true},
	filters: {type: Array, required: true},
});
const emit = defineEmits(['downloadReport']);
</script>
