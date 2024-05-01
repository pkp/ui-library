<template>
	<div>
		<h3 class="text-lg-bold text-heading">Editors assigned (t):</h3>
		<ul
			v-if="summaryStore.associatedEditors?.length"
			class="flex flex-col space-y-2"
		>
			<li
				v-for="editor in summaryStore.associatedEditors"
				:key="editor.id"
				class="text-base-normal"
			>
				<div class="text-base-bold">{{ editor.fullName }}</div>
				<div class="text-sm-normal text-secondary">{{ editor.roleName }}</div>
			</li>
		</ul>
		<span v-else class="-ms-3">
			<PkpButton
				is-link="true"
				@click="() => summaryStore.handleAction('assignParticipant')"
			>
				Assign Editors
			</PkpButton>
		</span>
	</div>
</template>
<script setup>
import {useSubmissionSummaryStore} from '../submissionSummaryStore';

const summaryStore = useSubmissionSummaryStore();
</script>
