<template>
	<pkp-textarea
		:label="t('userComment.report.reason')"
		:class="cn('reasonInput')"
		:model-value="reportText"
		@update:model-value="$emit('update:reportText', $event)"
	></pkp-textarea>
</template>
<script setup>
import {usePkpLocalize} from '@/frontend/composables/usePkpLocalize';
import {usePkpStyles} from '@/frontend/composables/usePkpStyles.js';

defineProps({
	reportText: {type: String, required: true},
});

defineEmits(['update:reportText']);

const {cn} = usePkpStyles('PkpCommentReportDialog');
const {t} = usePkpLocalize();
</script>
