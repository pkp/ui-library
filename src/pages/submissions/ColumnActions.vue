<template>
	<TableCell>
		<PkpButton
			class="submissions__list__item__view"
			:aria-describedby="'submission-title-' + submission.id"
			:is-link="true"
			@click="submissionsPageStore.openSummaryModal(submission)"
		>
			{{ t('editor.submission.viewSummary') }}
			<Icon class="ml-2 h-4 w-4" icon="pkp-open-right" :inline="true" />
		</PkpButton>
	</TableCell>
</template>
<script setup>
import {defineProps} from 'vue';
import PkpButton from '@/components/Button/Button.vue';
import TableCell from '@/components/TableNext/TableCell.vue';
import {useSubmissionsPageStore} from '@/pages/submissions/submissionsPageStore.js';
import Icon from '@/components/Icon/Icon.vue';

defineProps({
	submission: {type: Object, required: true},
});
const submissionsPageStore = useSubmissionsPageStore();
</script>
