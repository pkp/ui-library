<template>
	<TableCell>
		<DropdownActions
			label="More Actions (t)"
			:display-as-ellipsis="true"
			:actions="itemActions"
			@action="handleItemAction"
		/>
	</TableCell>
</template>

<script setup>
import TableCell from '@/components/TableNext/TableCell.vue';
import DropdownActions from '@/components/DropdownActions/DropdownActions.vue';
import {useReviewerManagerStore} from './reviewerManagerStore';
import {computed} from 'vue';
const props = defineProps({
	reviewAssignment: {type: Object, required: true},
	submission: {type: Object, required: true},
});

const reviewerManagerStore = useReviewerManagerStore();

const itemActions = computed(() =>
	reviewerManagerStore.getItemActions({
		reviewAssignment: props.reviewAssignment,
	}),
);

function handleItemAction(actionName) {
	reviewerManagerStore.handleItemAction(actionName, {
		submission: props.submission,
		submissionId: props.submission.id,
		submissionStageId: props.submission.stageId,
		reviewAssignment: props.reviewAssignment,
	});
}
</script>
