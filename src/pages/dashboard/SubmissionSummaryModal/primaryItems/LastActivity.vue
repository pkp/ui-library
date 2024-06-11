<template>
	<div class="flex justify-end border border-light p-4">
		<PkpButton @click="() => summaryStore.handleAction('viewActivityLog', {})">
			{{ t('dashboard.summary.viewActivityLog') }}
		</PkpButton>
	</div>
</template>

<script setup>
import PkpButton from '@/components/Button/Button.vue';
import {useLocalize} from '@/composables/useLocalize';
import {useSubmissionSummaryStore} from '../submissionSummaryStore';

const summaryStore = useSubmissionSummaryStore();
const {t} = useLocalize();
</script>
