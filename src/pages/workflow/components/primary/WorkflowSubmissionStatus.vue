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
import {useSubmission} from '@/composables/useSubmission.js';
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

const {t, tk} = useLocalize();
const {
	getActiveStage,
	hasNotSubmissionStartedStage,
	hasSubmissionPassedStage,
	getCurrentReviewRound,
	checkMinimumConsideredReviews,
} = useSubmission();

//const activeStage = computed(() => getActiveStage(props.submission));

const StageNames = {
	[pkp.const.WORKFLOW_STAGE_ID_INTERNAL_REVIEW]: tk(
		'workflow.review.internalReview',
	),
	[pkp.const.WORKFLOW_STAGE_ID_EXTERNAL_REVIEW]: tk(
		'workflow.review.externalReview',
	),
	[pkp.const.WORKFLOW_STAGE_ID_EDITING]: tk('submission.copyediting'),
	[pkp.const.WORKFLOW_STAGE_ID_PRODUCTION]: tk('submission.production'),
};

const message = computed(() => {
	// not initiated yet
	if (hasNotSubmissionStartedStage(props.submission, props.selectedStageId)) {
		return {
			heading: t('common.status'),
			body: t('workflow.stageNotStarted', {
				stage: t(StageNames[props.selectedStageId]),
			}),
		};
		// submission is in some future stage
	} else if (
		hasSubmissionPassedStage(props.submission, props.selectedStageId)
	) {
		const activeStage = getActiveStage(props.submission);

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
						stage: t(StageNames[activeStage.id]),
					}),
				};
			}
		}
		return {
			heading: t('common.status'),
			body: t('workflow.submissionInFutureStage', {
				stage: t(StageNames[activeStage.id]),
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
		if (props.submission.status === pkp.const.STATUS_PUBLISHED) {
			return {
				heading: t('common.status'),
				body: t('editor.submission.workflowDecision.submission.published'),
			};
		}
	}
	return null;
});
</script>
