import {useLocalize} from './useLocalize';
const {t, tk} = useLocalize();

export const ExtendedStages = {
	INCOMPLETE: 'incomplete',
	SUBMISSION: 'submission',
	INTERNAL_REVIEW: 'internalReview',
	EXTERNAL_REVIEW: 'externalReview',
	EDITING: 'editing',
	PRODUCTION_QUEUED: 'productionQueued',
	PRODUCTION_SCHEDULED: 'productionScheduled',
	PRODUCTION_PUBLISHED: 'productionPublished',
	DECLINED: 'declined',
};

export const ExtendedStagesLabels = {
	incomplete: tk('submissions.incomplete'),
	submission: tk('manager.publication.submissionStage'),
	internalReview: tk('submission.stage.internalReviewWithRound'),
	externalReview: tk('submission.stage.externalReviewWithRound'),
	editing: tk('submission.copyediting'),
	productionQueued: tk('manager.publication.productionStage'),
	productionScheduled: tk('submission.status.scheduled'),
	productionPublished: tk('submission.stage.published'),
	declined: tk('submissions.declined'),
};

export const StageLabels = {
	[pkp.const.WORKFLOW_STAGE_ID_SUBMISSION]: tk(
		'manager.publication.submissionStage',
	),
	[pkp.const.WORKFLOW_STAGE_ID_INTERNAL_REVIEW]: tk(
		'workflow.review.internalReview',
	),
	[pkp.const.WORKFLOW_STAGE_ID_EXTERNAL_REVIEW]: tk(
		'workflow.review.externalReview',
	),
	[pkp.const.WORKFLOW_STAGE_ID_EDITING]: tk('submission.copyediting'),
	[pkp.const.WORKFLOW_STAGE_ID_PRODUCTION]: tk(
		'manager.publication.productionStage',
	),
};

export const RecommendationTranslations = {
	[pkp.const.SUBMISSION_REVIEWER_RECOMMENDATION_ACCEPT]: tk(
		'reviewer.article.decision.accept',
	),
	[pkp.const.SUBMISSION_REVIEWER_RECOMMENDATION_PENDING_REVISIONS]: tk(
		'reviewer.article.decision.pendingRevisions',
	),
	[pkp.const.SUBMISSION_REVIEWER_RECOMMENDATION_RESUBMIT_HERE]: tk(
		'reviewer.article.decision.resubmitHere',
	),
	[pkp.const.SUBMISSION_REVIEWER_RECOMMENDATION_RESUBMIT_ELSEWHERE]: tk(
		'reviewer.article.decision.resubmitElsewhere',
	),
	[pkp.const.SUBMISSION_REVIEWER_RECOMMENDATION_DECLINE]: tk(
		'reviewer.article.decision.decline',
	),
	[pkp.const.SUBMISSION_REVIEWER_RECOMMENDATION_SEE_COMMENTS]: tk(
		'reviewer.article.decision.seeComments',
	),
};

const InProgressReviewAssignmentStatuses = [
	pkp.const.REVIEW_ASSIGNMENT_STATUS_ACCEPTED,
	pkp.const.REVIEW_ASSIGNMENT_STATUS_REVIEW_OVERDUE,
];

// Submitted reviews
export const CompletedReviewAssignmentStatuses = [
	pkp.const.REVIEW_ASSIGNMENT_STATUS_RECEIVED,
	pkp.const.REVIEW_ASSIGNMENT_STATUS_COMPLETE,
	pkp.const.REVIEW_ASSIGNMENT_STATUS_THANKED,
	pkp.const.REVIEW_ASSIGNMENT_STATUS_VIEWED,
];

const IgnoredReviewAssignmentStatuses = [
	pkp.const.REVIEW_ASSIGNMENT_STATUS_DECLINED,
	pkp.const.REVIEW_ASSIGNMENT_STATUS_CANCELLED,
];

export function useSubmission() {
	function getActiveStage(submission) {
		return submission.stages.find((stage) => stage.isActiveStage);
	}

	function getStageById(submission, stageId) {
		return submission.stages.find((stage) => stage.id === stageId);
	}

	function getSubmissionById(submissions, submissionId) {
		return submissions.find((submission) => submission.id === submissionId);
	}

	function getReviewAssignmentsForRound(reviewAssignments, roundId) {
		return reviewAssignments.filter(
			(reviewAssignment) => reviewAssignment.roundId === roundId,
		);
	}

	function getCurrentReviewRound(
		submission,
		stageId = pkp.const.WORKFLOW_STAGE_ID_EXTERNAL_REVIEW,
	) {
		const filteredReviewRoundByStage = submission?.reviewRounds.filter(
			(reviewRound) => reviewRound.stageId === stageId,
		);

		if (filteredReviewRoundByStage.length) {
			return filteredReviewRoundByStage[filteredReviewRoundByStage.length - 1];
		}
		return null;
	}

	function getReviewRound(submission, reviewRoundId) {
		return submission?.reviewRounds.find(
			(reviewRound) => reviewRound.id === reviewRoundId,
		);
	}

	function getReviewRoundsForStage(submission, stageId) {
		return submission?.reviewRounds.filter(
			(reviewRound) => reviewRound.stageId === stageId,
		);
	}

	function getCurrentReviewAssignments(submission, stageId) {
		const currentReviewRound = getCurrentReviewRound(submission, stageId);

		return submission.reviewAssignments.filter(
			(reviewAssignment) => reviewAssignment.round === currentReviewRound.round,
		);
	}

	function getCurrentPublication(submission) {
		return submission.publications.find(
			(publication) => publication.id === submission.currentPublicationId,
		);
	}

	function getLatestPublication(submission) {
		return submission.publications.reduce(
			(latestPublication, publication) =>
				publication.id > latestPublication.id ? publication : latestPublication,
			submission.publications[0],
		);
	}

	function getExtendedStage(submission) {
		const activeStage = getActiveStage(submission);
		if (submission.status === pkp.const.STATUS_DECLINED) {
			return ExtendedStages.DECLINED;
		}
		switch (activeStage.id) {
			case pkp.const.WORKFLOW_STAGE_ID_SUBMISSION:
				return submission.submissionProgress
					? ExtendedStages.INCOMPLETE
					: ExtendedStages.SUBMISSION;
			case pkp.const.WORKFLOW_STAGE_ID_INTERNAL_REVIEW:
				return ExtendedStages.INTERNAL_REVIEW;
			case pkp.const.WORKFLOW_STAGE_ID_EXTERNAL_REVIEW:
				return ExtendedStages.EXTERNAL_REVIEW;
			case pkp.const.WORKFLOW_STAGE_ID_EDITING:
				return ExtendedStages.EDITING;
			case pkp.const.WORKFLOW_STAGE_ID_PRODUCTION:
				switch (submission.status) {
					case pkp.const.STATUS_QUEUED:
						return ExtendedStages.PRODUCTION_QUEUED;
					case pkp.const.STATUS_SCHEDULED:
						return ExtendedStages.PRODUCTION_SCHEDULED;
					case pkp.const.STATUS_PUBLISHED:
						return ExtendedStages.PRODUCTION_PUBLISHED;
				}
		}
	}

	function getExtendedStageLabel(submission) {
		const extendedStage = getExtendedStage(submission);

		let round = undefined;

		const activeStage = getActiveStage(submission);

		if (
			activeStage.id === pkp.const.WORKFLOW_STAGE_ID_EXTERNAL_REVIEW ||
			activeStage.id === pkp.const.WORKFLOW_STAGE_ID_INTERNAL_REVIEW
		) {
			const rounds = getReviewRoundsForStage(submission, activeStage.id);
			round = rounds[rounds.length - 1].round;
		}

		return t(ExtendedStagesLabels[extendedStage], {
			round,
		});
	}

	function getStageLabel(submission) {
		return t(StageLabels[submission.stageId]);
	}

	function hasSubmissionPassedStage(submission, stageId) {
		return submission.stageId > stageId;
	}

	function hasNotSubmissionStartedStage(submission, stageId) {
		if (
			stageId === pkp.const.WORKFLOW_STAGE_ID_EXTERNAL_REVIEW ||
			stageId === pkp.const.WORKFLOW_STAGE_ID_INTERNAL_REVIEW
		) {
			const rounds = getReviewRoundsForStage(submission, stageId);
			return rounds?.length === 0;
		}

		return submission.stageId < stageId;
	}

	function getActiveReviewAssignments(reviewAssignments) {
		return reviewAssignments.filter(
			(reviewAssignment) =>
				!IgnoredReviewAssignmentStatuses.includes(reviewAssignment.statusId),
		);
	}

	function getCompletedReviewAssignments(reviewAssignments = []) {
		return getActiveReviewAssignments(reviewAssignments).filter(
			(reviewAssignment) =>
				CompletedReviewAssignmentStatuses.includes(reviewAssignment.statusId),
		);
	}

	function getOpenReviewAssignments(reviewAssignments) {
		return reviewAssignments.filter(
			(reviewAssignment) =>
				reviewAssignment.reviewMethod ===
				pkp.const.SUBMISSION_REVIEW_METHOD_OPEN,
		);
	}

	function getOpenReviewAssignmentsForRound(reviewAssignments, reviewRoundId) {
		return getReviewAssignmentsForRound(
			reviewAssignments,
			reviewRoundId,
		).filter(
			(reviewAssignment) =>
				reviewAssignment.reviewMethod ===
				pkp.const.SUBMISSION_REVIEW_METHOD_OPEN,
		);
	}

	function getOpenAndCompletedReviewAssignmentsForRound(
		reviewAssignments,
		reviewRoundId,
	) {
		return getOpenReviewAssignmentsForRound(
			reviewAssignments,
			reviewRoundId,
		).filter((reviewAssignment) => !!reviewAssignment.dateCompleted);
	}

	function isDecisionAvailable(submission, decisionId) {
		const stage = getActiveStage(submission);
		return submission?.availableEditorialDecisions?.some(
			(decision) => decision.id === decisionId && decision.stageId === stage.id,
		);
	}

	return {
		getSubmissionById,
		getActiveStage,
		getStageById,
		getStageLabel,
		getExtendedStage,
		getExtendedStageLabel,
		getCurrentReviewRound,
		getReviewRound,
		getReviewRoundsForStage,
		getCurrentReviewAssignments,
		getCurrentPublication,
		getLatestPublication,
		hasNotSubmissionStartedStage,
		hasSubmissionPassedStage,
		// review assignments
		getReviewAssignmentsForRound,
		getActiveReviewAssignments,
		getCompletedReviewAssignments,
		getOpenReviewAssignments,
		getOpenReviewAssignmentsForRound,
		getOpenAndCompletedReviewAssignmentsForRound,
		InProgressReviewAssignmentStatuses,
		isDecisionAvailable,
	};
}
