<template>
	<pkp-textarea
		:label="t('userComment.report.reason')"
		class="pkpCommentReportDialog__reason-input"
		:model-value="props.reportText"
		@update:model-value="updateReportText"
	></pkp-textarea>
</template>
<script setup>
import {inject} from 'vue';
import {usePkpLocalize} from '@/frontend/composables/usePkpLocalize';

const props = inject('reportDialogProps');
const emit = inject('reportDialogEmit');

const {t} = usePkpLocalize();

function updateReportText(value) {
	emit('update:reportText', value);
}
</script>
