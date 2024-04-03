<template>
	<SideModalBody>
		<template #title>Assign editors</template>
		<div class="p-4">
			<div class="bg-secondary p-4">
				<AjaxModalWrapper :options="{url: contentUrl}" />
			</div>
		</div>
	</SideModalBody>
</template>
<script setup>
/* eslint-disable */

import SideModalBody from '@/components/Modal/SideModalBody.vue';
import AjaxModalWrapper from '@/components/Modal/AjaxModalWrapper.vue';

const props = defineProps({selectedSubmission: {type: Object, required: true}});

const {selectedSubmission: submission} = submissionsPageStore;

const contentUrl = submissionsPageStore.assignParticipantUrl
	.replace('__id__', submission.id)
	.replace('__stageId__', submission.stageId);
</script>
