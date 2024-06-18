<template>
	<PkpButton
		:is-primary="isPrimary"
		:is-secondary="isSecondary"
		:is-warnable="isWarnable"
		@click="() => handleAction(action, {})"
	>
		{{ label }}
	</PkpButton>
</template>
<script setup>
import PkpButton from '@/components/Button/Button.vue';

import {useSubmissionSummaryStore} from '../submissionSummaryStore';

const {handleAction} = useSubmissionSummaryStore();

defineProps({
	isPrimary: {type: Boolean, required: false, default: false},
	isSecondary: {type: Boolean, required: false, default: false},
	isWarnable: {type: Boolean, required: false, default: false},
	action: {type: String, required: true},
	label: {type: String, required: true},
});
</script>
