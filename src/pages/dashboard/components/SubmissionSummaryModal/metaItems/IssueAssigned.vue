<template>
	<div class="mt-4">
		<h3 class="text-lg-bold">Issue No (t):</h3>
		<div class="flex">
			<p>Not assigned</p>
			<PkpButton
				:is-link="true"
				@click="summaryStore.handleAction('assignToIssue', {})"
			>
				Assign To Issue
			</PkpButton>
		</div>
	</div>
</template>
<script setup>
import {useSubmissionSummaryStore} from '../submissionSummaryStore';

const summaryStore = useSubmissionSummaryStore();
</script>
