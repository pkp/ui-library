<template>
	<SideModalBody secondary="true">
		<template #header><h1 class="text-4xl-bold">Assign editors</h1></template>
		<div class="p-4">
			<div class="bg-lightest p-4">
				<AjaxModalWrapper :content-url="contentUrl" />
			</div>
		</div>
	</SideModalBody>
</template>
<script setup>
import SideModalBody from '@/components/Modal/SideModalBody.vue';
import {useSubmissionsPageStore} from '@/pages/submissions/submissionsPageStore.js';
import AjaxModalWrapper from '@/components/Modal/AjaxModalWrapper.vue';

const submissionsPageStore = useSubmissionsPageStore();

const {selectedSubmission: submission} = submissionsPageStore;

const contentUrl = submissionsPageStore.assignParticipantUrl
	.replace('__id__', submission.id)
	.replace('__stageId__', submission.stageId);
</script>
