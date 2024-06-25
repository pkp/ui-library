<template>
	<SideModalBody>
		<template #title>
			{{ t('common.download') }}
		</template>
		<SideModalLayoutBasic>
			<p>{{ t('stats.context.downloadReport.description') }}</p>
			<table class="pkpTable pkpStats__reportParams">
				<tr class="pkpTable__row">
					<th>{{ t('stats.dateRange') }}</th>
					<td>{{ dateRangeDescription }}</td>
				</tr>
			</table>
			<action-panel class="pkpStats__reportAction">
				<h2>{{ t('context.context') }}</h2>
				<p>
					{{ t('stats.context.downloadReport.downloadContext.description') }}
				</p>
				<template #actions>
					<pkp-button @click="() => emit('downloadReport', null)">
						{{ t('stats.context.downloadReport.downloadContext') }}
					</pkp-button>
				</template>
			</action-panel>
			<action-panel class="pkpStats__reportAction">
				<h2>{{ t('stats.timeline') }}</h2>
				<p>
					{{ timelineDescription }}
				</p>
				<template #actions>
					<pkp-button @click="() => emit('downloadReport', 'timeline')">
						{{ t('stats.timeline.downloadReport.downloadTimeline') }}
					</pkp-button>
				</template>
			</action-panel>
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
	dateRangeDescription: {type: String, required: true},
	timelineDescription: {type: String, required: true},
});
const emit = defineEmits(['downloadReport']);
</script>
