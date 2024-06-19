<template>
	<SideModalBody>
		<template #title>
			{{ title }}
		</template>
		<SideModalLayoutBasic>
			<p>{{ t('stats.issues.downloadReport.description') }}</p>
			<table class="pkpTable pkpStats__reportParams">
				<tr class="pkpTable__row">
					<th>{{ t('stats.dateRange') }}</th>
					<td>{{ dateRangeDescription }}</td>
				</tr>
				<tr v-if="searchPhrase" class="pkpTable__row">
					<th>{{ t('common.searchPhrase') }}</th>
					<td>{{ searchPhrase }}</td>
				</tr>
			</table>
			<ActionPanel class="pkpStats__reportAction">
				<h2>{{ t('issue.issues') }}</h2>
				<p>
					{{ t('stats.issues.downloadReport.downloadIssues.description') }}
				</p>
				<template #actions>
					<PkpButton @click="() => emit('downloadReport', null)">
						{{ t('stats.issues.downloadReport.downloadIssues') }}
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

const {t} = useLocalize();
defineProps({
	title: {type: String, required: true},
	searchPhrase: {type: String, required: false, default: ''},
	timelineDescription: {type: String, required: true},
	dateRangeDescription: {type: String, required: true},
});
const emit = defineEmits(['downloadReport']);
</script>
