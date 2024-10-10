<template>
	<PkpButton
		:is-primary="isPrimary"
		:is-secondary="isSecondary"
		:is-warnable="isWarnable"
		@click="() => store[action](actionArgs)"
	>
		{{ label }}
	</PkpButton>
</template>
<script setup>
import PkpButton from '@/components/Button/Button.vue';

defineProps({
	isPrimary: {type: Boolean, required: false, default: false},
	isSecondary: {type: Boolean, required: false, default: false},
	isWarnable: {type: Boolean, required: false, default: false},
	action: {type: String, required: true},
	actionArgs: {type: Object, required: false, default: () => {}},
	label: {type: String, required: true},
});

import {useWorkflowStore} from '@/pages/workflow/workflowStore';

const store = useWorkflowStore();
</script>
