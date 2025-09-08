<template>
	<div class="BaseCommentReportDialog"><slot></slot></div>
</template>
<script setup>
import {provide} from 'vue';
const props = defineProps({
	comment: {type: Object, required: true},
	reportText: {type: String, required: true},
});

const emit = defineEmits(['update:reportText']);
console.log('BaseCommentReportDialog props', props);
provide('reportDialogProps', props);
provide('reportDialogEmit', emit);
</script>
