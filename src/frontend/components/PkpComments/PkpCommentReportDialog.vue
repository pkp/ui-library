<template>
	<BaseCommentReportDialogBase
		:comment="comment"
		:report-text="reportText"
		@update:report-text="$emit('update:reportText', $event)"
	>
		<BaseCommentReportDialogAuthor></BaseCommentReportDialogAuthor>
		<p
			v-strip-unsafe-html="comment.commentText.trim()"
			:class="cn('commentText')"
		></p>
		<BaseCommentReportDialogReasonInput></BaseCommentReportDialogReasonInput>
	</BaseCommentReportDialogBase>
</template>

<script setup>
import BaseCommentReportDialogBase from './base/BaseCommentReportDialogBase.vue';
import BaseCommentReportDialogAuthor from './base/BaseCommentReportDialogAuthor.vue';
import BaseCommentReportDialogReasonInput from './base/BaseCommentReportDialogReasonInput.vue';
import {usePkpStyles} from '@/frontend/composables/usePkpStyles.js';

const props = defineProps({
	comment: {type: Object, required: true},
	reportText: {type: String, required: true},
	styles: {type: Object, default: () => ({})},
});

defineEmits(['update:reportText']);

const {cn} = usePkpStyles(props.styles);
</script>
