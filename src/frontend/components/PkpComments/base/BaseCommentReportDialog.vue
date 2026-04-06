<template>
	<div :class="cn('root')">
		<slot>
			<BaseCommentReportDialogAuthor :comment="comment" />
			<p
				v-strip-unsafe-html="comment.commentText.trim()"
				:class="cn('commentText')"
			></p>
			<BaseCommentReportDialogReasonInput
				:report-text="reportText"
				@update:report-text="$emit('update:reportText', $event)"
			/>
		</slot>
	</div>
</template>
<script setup>
import {usePkpStyles} from '@/frontend/composables/usePkpStyles.js';
import BaseCommentReportDialogAuthor from './BaseCommentReportDialogAuthor.vue';
import BaseCommentReportDialogReasonInput from './BaseCommentReportDialogReasonInput.vue';

const props = defineProps({
	comment: {type: Object, required: true},
	reportText: {type: String, required: true},
	styles: {type: Object, default: () => ({})},
});

defineEmits(['update:reportText']);

const {cn} = usePkpStyles('PkpCommentReportDialog', props.styles);
</script>
