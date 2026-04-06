<template>
	<BaseCommentReportDialog
		v-bind="$props"
		@update:report-text="$emit('update:reportText', $event)"
	/>
</template>

<script setup>
import BaseCommentReportDialog from './base/BaseCommentReportDialog.vue';

defineProps({
	comment: {type: Object, required: true},
	reportText: {type: String, required: true},
	styles: {type: Object, default: () => ({})},
});

defineEmits(['update:reportText']);
</script>
