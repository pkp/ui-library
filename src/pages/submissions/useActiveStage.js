import {computed} from 'vue';

export function useActiveStage(submission) {
	const activeStage = computed(() =>
		submission.stages.find((stage) => stage.isActiveStage),
	);

	const isWorkflowStageSubmission = computed(() => {
		return activeStage.value.id === pkp.const.WORKFLOW_STAGE_ID_SUBMISSION;
	});

	const isStatusSubmissionUnassigned = computed(() => {
		return (
			isWorkflowStageSubmission.value &&
			activeStage.value?.statusId ===
				pkp.const.STAGE_STATUS_SUBMISSION_UNASSIGNED
		);
	});

	const isWorkflowStageInternalReview = computed(() => {
		return activeStage.value.id === pkp.const.WORKFLOW_STAGE_ID_INTERNAL_REVIEW;
	});

	const isWorkflowStageExternalReview = computed(() => {
		return activeStage.value.id === pkp.const.WORKFLOW_STAGE_ID_EXTERNAL_REVIEW;
	});

	const isWorkflowStageEditing = computed(() => {
		return activeStage.value.id === pkp.const.WORKFLOW_STAGE_ID_EDITING;
	});

	const isWorkflowStageProduction = computed(() => {
		return activeStage.value.id === pkp.const.WORKFLOW_STAGE_ID_PRODUCTION;
	});

	const activeReviewRound = computed(() => {
		return submission.reviewRounds[submission.reviewRounds.length - 1];
	});
	const activeReviewAssignments = computed(() => {
		return submission.reviewAssignments.filter(
			(reviewAssignment) =>
				reviewAssignment.round === activeReviewRound.value.round,
		);
	});

	return {
		activeStage,
		activeReviewAssignments,
		isStatusSubmissionUnassigned,
		isWorkflowStageSubmission,
		isWorkflowStageInternalReview,
		isWorkflowStageExternalReview,
		isWorkflowStageEditing,
		isWorkflowStageProduction,
	};
}
