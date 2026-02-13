<template>
	<template v-if="submission">
		<DiscussionManager
			:submission="submission"
			:submission-stage-id="submissionStageId"
		></DiscussionManager>
	</template>
</template>

<script setup>
import {useFetch} from '@/composables/useFetch';
import {useUrl} from '@/composables/useUrl';
import {useDataChangedProvider} from '@/composables/useDataChangedProvider';
import DiscussionManager from './DiscussionManager.vue';

useDataChangedProvider();

const props = defineProps({
	submissionId: {type: String, required: true},
	submissionStageId: {type: Number, required: true},
});

const {apiUrl: submissionApiUrl} = useUrl(
	`submissions/${encodeURIComponent(props.submissionId)}`,
);
const {data: submission, fetch: fetchSubmission} = useFetch(submissionApiUrl);
fetchSubmission();
</script>
