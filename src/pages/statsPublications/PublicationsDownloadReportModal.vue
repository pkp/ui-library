<template>
	<SideModalBody>
		<template #title>
			{{ title }}
		</template>
		<SideModalLayoutBasic>
			<p>{{ t('stats.publications.downloadReport.description') }}</p>
			<table class="pkpTable pkpStats__reportParams">
				<tr class="pkpTable__row">
					<th>{{ t('stats.dateRange') }}</th>
					<td>{{ dateRangeDescription }}</td>
				</tr>
				<tr
					v-for="(filterSet, index) in filters"
					:key="index"
					class="pkpTable__row"
				>
					<th>{{ filterSet.heading }}</th>
					<td>{{ getFilterDescription(filterSet) }}</td>
				</tr>
				<tr v-if="searchPhrase" class="pkpTable__row">
					<th>{{ t('common.searchPhrase') }}</th>
					<td>{{ searchPhrase }}</td>
				</tr>
			</table>
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
					{{ t('common.geographic') }}
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

const {t} = useLocalize();
defineProps({
	title: {type: String, required: true},
	searchPhrase: {type: String, required: false, default: ''},
	dateRangeDescription: {type: String, required: true},
	timelineDescription: {type: String, required: true},
	geoReportType: {type: String, required: false, default: null},
	getFilterDescription: {type: Function, required: true},
	filters: {type: Array, required: true},
});
const emit = defineEmits(['downloadReport']);
</script>
