<template>
	<p
		v-strip-unsafe-html="props.comment.commentText.trim()"
		class="pkpUserCommentReportModal____commentText"
	></p>
</template>
<script setup>
import {inject} from 'vue';
const props = inject('reportDialogProps');
</script>
