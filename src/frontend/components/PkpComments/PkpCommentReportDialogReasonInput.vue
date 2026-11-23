<template>
	<PkpTextarea
		:label="t('userComment.report.reason')"
		:class="cn('root')"
		:model-value="reportText"
		@update:model-value="$emit('update:reportText', $event)"
	></PkpTextarea>
</template>
<script setup>
import PkpTextarea from '@/frontend/components/PkpTextarea/PkpTextarea.vue';
import {usePkpLocalize} from '@/frontend/composables/usePkpLocalize';
import {usePkpStyles} from '@/frontend/composables/usePkpStyles.js';

const props = defineProps({
	reportText: {type: String, required: true},
	styles: {type: Object, default: () => ({})},
});

defineEmits(['update:reportText']);

const {cn} = usePkpStyles('PkpCommentReportDialogReasonInput', props.styles);
const {t} = usePkpLocalize();
</script>
