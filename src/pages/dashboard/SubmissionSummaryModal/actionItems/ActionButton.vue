<template>
	<PkpButton
		:is-primary="isPrimary"
		:is-secondary="isSecondary"
		:is-warnable="isWarnable"
		@click="() => actionFn(store)"
	>
		{{ label }}
	</PkpButton>
</template>
<script setup>
import PkpButton from '@/components/Button/Button.vue';

import {useSubmissionSummaryStore} from '../submissionSummaryStore';

const store = useSubmissionSummaryStore();

defineProps({
	isPrimary: {type: Boolean, required: false, default: false},
	isSecondary: {type: Boolean, required: false, default: false},
	isWarnable: {type: Boolean, required: false, default: false},
	actionFn: {type: Function, required: true},
	action: {type: String, required: true},
	actionArgs: {type: Object, required: false, default: () => {}},
	label: {type: String, required: true},
});
</script>
