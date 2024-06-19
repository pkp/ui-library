<template>
	<div class="mt-4">
		<h3 class="text-lg-bold">{{ t('dashboard.summary.issueNo') }}:</h3>
		<div class="flex justify-between">
			<span class="text-base-normal">
				<p v-if="summaryStore.issue">{{ summaryStore.issue.identification }}</p>
				<p v-else>{{ t('dashboard.summary.notAssigned') }}</p>
			</span>

			<span class="-mt-4">
				<PkpButton
					v-if="!isReadOnly && !summaryStore.issue"
					:is-link="true"
					@click="summaryStore.handleAction('assignToIssue', {})"
				>
					{{ t('dashboard.summary.assignToIssue') }}
				</PkpButton>
			</span>
		</div>
	</div>
</template>
<script setup>
import {useSubmissionSummaryStore} from '../submissionSummaryStore';
import {useLocalize} from '@/composables/useLocalize';
const summaryStore = useSubmissionSummaryStore();

defineProps({isReadOnly: {type: Boolean, required: true}});

const {t} = useLocalize();
</script>
