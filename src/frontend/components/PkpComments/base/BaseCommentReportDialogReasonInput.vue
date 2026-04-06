<template>
	<PkpTextarea
		:label="t('userComment.report.reason')"
		:class="cn('reasonInput')"
		:model-value="reportText"
		@update:model-value="$emit('update:reportText', $event)"
	></PkpTextarea>
</template>
<script setup>
import PkpTextarea from '@/frontend/components/PkpTextarea/PkpTextarea.vue';
import {usePkpLocalize} from '@/frontend/composables/usePkpLocalize';
import {usePkpStyles} from '@/frontend/composables/usePkpStyles.js';

defineProps({
	reportText: {type: String, required: true},
});

defineEmits(['update:reportText']);

const {cn} = usePkpStyles('PkpCommentReportDialog');
const {t} = usePkpLocalize();
</script>
