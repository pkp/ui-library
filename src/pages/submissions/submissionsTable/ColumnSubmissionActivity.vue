<template>
	<TableCell>
		<PkpButton
			v-if="canUserAssignEditor"
			@click="submissionsPageStore.openAssignParticipantModal(submission)"
		>
			{{ t('submission.list.assignEditor') }}
		</PkpButton>
		<template v-if="isWorkflowStageExternalReview">
			<ReviewActivityIndicatorPopup
				v-for="reviewAssignment in activeReviewAssignments"
				:key="reviewAssignment.id"
				status="completed"
			/>
		</template>
	</TableCell>
</template>

<script setup>
import {defineProps} from 'vue';
import TableCell from '@/components/TableNext/TableCell.vue';
import ReviewActivityIndicatorPopup from '@/components/ReviewActivityIndicatorPopover/ReviewActivityIndicatorPopover.vue';
import {useSubmissionsPageStore} from '@/pages/submissions/submissionsPageStore';
import PkpButton from '@/components/Button/Button.vue';
import {useSubmission} from '../useSubmission';
import {useActiveStage} from '../useActiveStage';

const props = defineProps({submission: {type: Object, required: true}});

const {canUserAssignEditor} = useSubmission(props.submission);
const {isWorkflowStageExternalReview, activeReviewAssignments} = useActiveStage(
	props.submission,
);
const submissionsPageStore = useSubmissionsPageStore();
</script>
