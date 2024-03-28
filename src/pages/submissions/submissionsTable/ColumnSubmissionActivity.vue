<template>
	<TableCell>
		<PkpButton
			v-if="canUserAssignEditor"
			size-variant="compact"
			@click="submissionsPageStore.openAssignParticipantModal(item)"
		>
			{{ t('submission.list.assignEditor') }}
		</PkpButton>
		<span v-if="isWorkflowStageExternalReview" class="space-x-1">
			<ReviewActivityIndicatorPopup
				v-for="reviewAssignment in activeReviewAssignments"
				:key="reviewAssignment.id"
				:review-assignment="reviewAssignment"
				:reviewer-name="'Reviewer name (todo)'"
				:submission-id="item.id"
			/>
		</span>
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

const props = defineProps({item: {type: Object, required: true}});

const {canUserAssignEditor} = useSubmission(props.item);
const {isWorkflowStageExternalReview, activeReviewAssignments} = useActiveStage(
	props.item,
);
const submissionsPageStore = useSubmissionsPageStore();
</script>
