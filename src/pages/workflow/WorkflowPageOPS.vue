<template>
	<WorkflowPage />
</template>

<script setup>
import WorkflowPage from './WorkflowPage.vue';
import {useWorkflowStore} from './workflowStoreOPS';

const props = defineProps({
	submissionId: {type: Number, required: true},
	pageInitConfig: {type: Object, required: true},
});

useWorkflowStore(props);
</script>
