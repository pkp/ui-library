<template>
	<SideModalBody>
		<template #pre-title>
			{{ 15 }}
		</template>
		<template #title>
			<span>Title</span>
		</template>
		<template #description>Description</template>
		<div class="p-4">
			<div class="bg-secondary p-4">
				<div>SubmissionId {{ submissionId }}</div>
				<div>ReviewAssignmentId {{ reviewAssignmentId }}</div>
			</div>
			<PkpButton @click="submitThings">Submit Things</PkpButton>
		</div>
	</SideModalBody>
</template>

<script setup>
import {inject} from 'vue';
import SideModalBody from '@/components/Modal/SideModalBody.vue';
import PkpButton from '@/components/Button/Button.vue';

const props = defineProps({
	submissionId: {type: Number, required: true},
	reviewAssignmentId: {type: Number, required: true},
	legacyOptions: {type: Object, required: true},
});
const closeModal = inject('closeModal');

function submitThings() {
	// pass events to the Grid, to trigger reload if action changed the data
	props.legacyOptions.modalHandler
		.getHtmlElement()
		.trigger('dataChanged', props.reviewAssignmentId);
	closeModal();
}
</script>
