<template>
	<pkp-textarea
		class="BaseCommentReportDialogReasonInput"
		:model-value="props.reportText"
		@update:model-value="updateReportText"
	></pkp-textarea>
</template>
<script setup>
import {inject} from 'vue';

const props = inject('reportDialogProps');
const emit = inject('reportDialogEmit');

function updateReportText(value) {
	emit('update:reportText', value);
}
</script>
