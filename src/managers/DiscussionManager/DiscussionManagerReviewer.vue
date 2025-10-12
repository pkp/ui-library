<template>
	<template v-if="submission">
		<DiscussionManager
			:submission="submission"
			:submission-stage-id="submissionStageId"
		></DiscussionManager>
	</template>
</template>

<script setup>
import {useWorkflowDataSubmissionPublication} from '@/pages/workflow/composables/useWorkflowDataSubmissionPublication';
import DiscussionManager from './DiscussionManager.vue';

const props = defineProps({
	submissionId: {type: String, required: true},
	submissionStageId: {type: Number, required: true},
});

const {submission} = useWorkflowDataSubmissionPublication({
	submissionId: props.submissionId,
});
</script>
