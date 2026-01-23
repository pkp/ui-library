<template>
	<BaseCommentReportDialogBase
		:comment="comment"
		:report-text="reportText"
		@update:report-text="$emit('update:reportText', $event)"
	>
		<BaseCommentReportDialogAuthor></BaseCommentReportDialogAuthor>
		<p
			v-strip-unsafe-html="comment.commentText.trim()"
			class="pkpCommentReportDialog__comment-text"
		></p>
		<BaseCommentReportDialogReasonInput></BaseCommentReportDialogReasonInput>
	</BaseCommentReportDialogBase>
</template>

<script setup>
import BaseCommentReportDialogBase from './base/BaseCommentReportDialogBase.vue';
import BaseCommentReportDialogAuthor from './base/BaseCommentReportDialogAuthor.vue';
import BaseCommentReportDialogReasonInput from './base/BaseCommentReportDialogReasonInput.vue';

defineProps({
	comment: {type: Object, required: true},
	reportText: {type: String, required: true},
});

defineEmits(['update:reportText']);
</script>
