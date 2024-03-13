<template>
	<TableCell>
		<PkpButton
			class="whitespace-nowrap"
			:aria-describedby="'submission-title-' + submission.id"
			:is-link="true"
			@click="submissionsPageStore.openSummaryModal(submission)"
		>
			{{ t('editor.submission.viewSummary') }}
		</PkpButton>
	</TableCell>
</template>
<script setup>
import {defineProps} from 'vue';
import PkpButton from '@/components/Button/Button.vue';
import TableCell from '@/components/TableNext/TableCell.vue';
import {useSubmissionsPageStore} from '@/pages/submissions/submissionsPageStore.js';

defineProps({
	submission: {type: Object, required: true},
});
const submissionsPageStore = useSubmissionsPageStore();
</script>
