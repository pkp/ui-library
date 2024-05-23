<template>
	<div class="mt-4">
		<h3 class="text-lg-bold">Issue No (t):</h3>
		<div class="flex justify-between">
			<span class="text-base-normal">
				<p v-if="summaryStore.issue">{{ summaryStore.issue.identification }}</p>
				<p v-else>Not assigned</p>
			</span>

			<span class="-mt-4">
				<PkpButton
					v-if="!isReadOnly && !summaryStore.issue"
					:is-link="true"
					@click="summaryStore.handleAction('assignToIssue', {})"
				>
					Assign To Issue
				</PkpButton>
			</span>
		</div>
	</div>
</template>
<script setup>
import {useSubmissionSummaryStore} from '../submissionSummaryStore';

const summaryStore = useSubmissionSummaryStore();

defineProps({isReadOnly: {type: Boolean, required: true}});
</script>
