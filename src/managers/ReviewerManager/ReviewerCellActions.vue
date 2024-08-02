<template>
	<TableCell>
		<DropdownActions
			label="More Actions (t)"
			:display-as-ellipsis="true"
			:actions="actionsList"
			@action="handleReviewAction"
		/>
	</TableCell>
</template>

<script setup>
import TableCell from '@/components/TableNext/TableCell.vue';
import DropdownActions from '@/components/DropdownActions/DropdownActions.vue';
import {useReviewerManagerActions} from './useReviewerManagerActions';
import {computed} from 'vue';
const props = defineProps({
	reviewAssignment: {type: Object, required: true},
	submission: {type: Object, required: true},
});

const {getAvailableActions, handleAction} = useReviewerManagerActions();

const actionsList = computed(() => {
	return getAvailableActions(props.reviewAssignment);
});

function handleReviewAction(actionName) {
	handleAction(actionName, {
		submission: props.submission,
		submissionId: props.submission.id,
		submissionStageId: props.submission.stageId,
		reviewAssignment: props.reviewAssignment,
	});
}
</script>
