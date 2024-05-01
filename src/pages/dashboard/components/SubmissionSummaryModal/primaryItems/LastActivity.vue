<template>
	<div class="flex justify-end border border-light p-4">
		<PkpButton @click="() => summaryStore.handleAction('viewActivityLog', {})">
			View activity log
		</PkpButton>
	</div>
</template>

<script setup>
import PkpButton from '@/components/Button/Button.vue';
import {useSubmissionSummaryStore} from '../submissionSummaryStore';

const summaryStore = useSubmissionSummaryStore();
</script>
