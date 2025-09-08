<template>
	<BaseCommentReportDialog v-bind="$attrs">
		<BaseCommentReportDialogAuthor></BaseCommentReportDialogAuthor>
		<BaseCommentReportDialogCommentText></BaseCommentReportDialogCommentText>
		<BaseCommentReportDialogReasonInput></BaseCommentReportDialogReasonInput>
	</BaseCommentReportDialog>
</template>
<script setup>
import BaseCommentReportDialog from './base/BaseCommentReportDialog.vue';
import BaseCommentReportDialogAuthor from './base/BaseCommentReportDialogAuthor.vue';
import BaseCommentReportDialogCommentText from './base/BaseCommentReportDialogCommentText.vue';
import BaseCommentReportDialogReasonInput from './base/BaseCommentReportDialogReasonInput.vue';
</script>
