<template>
	<div v-if="message" class="border border-light p-4">
		<h3 v-if="message.heading" class="mb-2 text-lg-bold text-heading">
			{{ message.heading }}
		</h3>
		<p v-if="message.body1" class="mb-2 text-sm-normal">{{ message.body1 }}</p>
		<p v-if="message.body" class="text-sm-normal">{{ message.body }}</p>
	</div>
</template>
<script setup>
import {computed} from 'vue';
import {useSubmission, StageLabels} from '@/composables/useSubmission.js';
import {useLocalize} from '@/composables/useLocalize';

const props = defineProps({
	submission: {
		type: Object,
		required: true,
	},
	selectedStageId: {type: Number, required: true},
	selectedReviewRoundId: {type: Number, required: false, default: null},
	contextMinReviewsPerSubmission: {type: Number, required: true},
});

const {t} = useLocalize();
const {
	getActiveStage,
	getStageById,
	hasNotSubmissionStartedStage,
	getCurrentReviewRound,
	checkMinimumConsideredReviews,
} = useSubmission();

// The Done stage sits outside the normal stage progression, so for status-message purposes
// treat it as the stage the submission occupied immediately before entering Done (exposed by
// the backend as `returnStageId`) — a VoR isn't necessarily published from Production.
function getMessagingStageId(stageId) {
	if (stageId !== pkp.const.WORKFLOW_STAGE_ID_DONE) {
		return stageId;
	}
	return (
		getStageById(props.submission, pkp.const.WORKFLOW_STAGE_ID_DONE)
			?.returnStageId ?? pkp.const.WORKFLOW_STAGE_ID_PRODUCTION
	);
}

const message = computed(() => {
	// not initiated yet
	if (hasNotSubmissionStartedStage(props.submission, props.selectedStageId)) {
		return {
			heading: t('common.status'),
			body: t('workflow.stageNotStarted', {
				stage: t(StageLabels[props.selectedStageId]),
			}),
		};
		// submission is in some future stage
	} else if (
		getMessagingStageId(props.submission.stageId) > props.selectedStageId
	) {
		const activeStageId = getMessagingStageId(
			getActiveStage(props.submission).id,
		);

		// more detailed messaging for review rounds that has been moved to the next review round
		if (
			props.selectedStageId === pkp.const.WORKFLOW_STAGE_ID_EXTERNAL_REVIEW ||
			props.selectedStageId === pkp.const.WORKFLOW_STAGE_ID_INTERNAL_REVIEW
		) {
			const currentReviewRound = getCurrentReviewRound(
				props.submission,
				props.selectedStageId,
			);

			if (props.selectedReviewRoundId < currentReviewRound.id) {
				return {
					heading: t('common.status'),
					body: t('workflow.submissionNextReviewRoundInFutureStage', {
						stage: t(StageLabels[activeStageId]),
					}),
				};
			}
		}
		return {
			heading: t('common.status'),
			body: t('workflow.submissionInFutureStage', {
				stage: t(StageLabels[activeStageId]),
			}),
		};
		// when active stage is review stage
	} else if (
		props.selectedStageId === pkp.const.WORKFLOW_STAGE_ID_EXTERNAL_REVIEW ||
		props.selectedStageId === pkp.const.WORKFLOW_STAGE_ID_INTERNAL_REVIEW
	) {
		const currentReviewRound = getCurrentReviewRound(
			props.submission,
			props.selectedStageId,
		);

		if (props.selectedReviewRoundId < currentReviewRound.id) {
			return {
				heading: t('common.status'),
				body: t('workflow.submissionInNextReviewRound'),
			};
		}

		// #10363 Add minimum reviewers status
		const {shouldMinimumReviewsBeConsidered, hasMinimumReviewsCount} =
			checkMinimumConsideredReviews(
				props.submission,
				props.selectedStageId,
				props.selectedReviewRoundId,
				props.contextMinReviewsPerSubmission,
			);

		if (
			// only for these statuses the minimum reviews completed status should take precedence
			shouldMinimumReviewsBeConsidered &&
			hasMinimumReviewsCount &&
			[
				pkp.const.REVIEW_ROUND_STATUS_PENDING_REVIEWERS,
				pkp.const.REVIEW_ROUND_STATUS_PENDING_REVIEWS,
				pkp.const.REVIEW_ROUND_STATUS_REVIEWS_READY,
				pkp.const.REVIEW_ROUND_STATUS_REVIEWS_COMPLETED,
				pkp.const.REVIEW_ROUND_STATUS_REVIEWS_OVERDUE,
			].includes(currentReviewRound.statusId)
		) {
			return {
				heading: t('notification.type.roundStatusTitle', {
					round: currentReviewRound.round,
				}),
				body1: t('dashboard.minimumConfirmedReviewsRequired', {
					number: props.contextMinReviewsPerSubmission,
				}),
				body: t('dashboard.minimumReviewsConfirmedDecisionNeeded'),
			};
		} else if (
			// when reviews are completed, but its not enough reviews yet
			// in this case does not make sense to indicate the 'COMPLETED' status
			// agreed on indicate only number of minimum reviews
			shouldMinimumReviewsBeConsidered &&
			[pkp.const.REVIEW_ROUND_STATUS_REVIEWS_COMPLETED].includes(
				currentReviewRound.statusId,
			)
		) {
			return {
				heading: t('notification.type.roundStatusTitle', {
					round: currentReviewRound.round,
				}),
				body1: t('dashboard.minimumConfirmedReviewsRequired', {
					number: props.contextMinReviewsPerSubmission,
				}),
			};
		}

		return {
			heading: t('notification.type.roundStatusTitle', {
				round: currentReviewRound.round,
			}),
			body1: shouldMinimumReviewsBeConsidered
				? t('dashboard.minimumConfirmedReviewsRequired', {
						number: props.contextMinReviewsPerSubmission,
					})
				: null,
			body: currentReviewRound.status,
		};
	} else if (props.selectedStageId === pkp.const.WORKFLOW_STAGE_ID_PRODUCTION) {
		if (props.submission.status === pkp.const.submission.STATUS_PUBLISHED) {
			return {
				heading: t('common.status'),
				body: t('editor.submission.workflowDecision.submission.published'),
			};
		}
	}
	return null;
});
</script>
