import {useLocalize} from './useLocalize';
const {t, tk} = useLocalize();

/**
 * Extended stages for submission workflow with additional states
 * @type {Object}
 */
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

/**
 * Translation keys for extended stages
 * @type {Object}
 */
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

/**
 * Translation keys for workflow stages
 * @type {Object}
 */
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

/**
 * Translation keys for reviewer recommendations
 * @type {Object}
 */
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

/**
 * Review assignment statuses that indicate the review is in progress
 * @type {Array<number>}
 */
const InProgressReviewAssignmentStatuses = [
	pkp.const.REVIEW_ASSIGNMENT_STATUS_ACCEPTED,
	pkp.const.REVIEW_ASSIGNMENT_STATUS_REVIEW_OVERDUE,
];

/**
 * Review assignment statuses that indicate the review is completed/submitted
 * @type {Array<number>}
 */
export const CompletedReviewAssignmentStatuses = [
	pkp.const.REVIEW_ASSIGNMENT_STATUS_RECEIVED,
	pkp.const.REVIEW_ASSIGNMENT_STATUS_COMPLETE,
	pkp.const.REVIEW_ASSIGNMENT_STATUS_THANKED,
	pkp.const.REVIEW_ASSIGNMENT_STATUS_VIEWED,
];

/**
 * Review assignment statuses that indicate the review is confirmed by editor
 * @type {Array<number>}
 */
export const ConfirmedReviewAssignmentStatuses = [
	pkp.const.REVIEW_ASSIGNMENT_STATUS_COMPLETE,
	pkp.const.REVIEW_ASSIGNMENT_STATUS_THANKED,
];

/**
 * Review assignment statuses to ignore (declined or cancelled)
 * @type {Array<number>}
 */
const IgnoredReviewAssignmentStatuses = [
	pkp.const.REVIEW_ASSIGNMENT_STATUS_DECLINED,
	pkp.const.REVIEW_ASSIGNMENT_STATUS_CANCELLED,
];

/**
 * Provides functions for working with submissions, stages, and review assignments
 */
export function useSubmission() {
	/**
	 * Get the active stage for a submission
	 * @param {Object} submission - The submission object
	 * @returns {Object|undefined} The active stage object or undefined
	 */
	function getActiveStage(submission) {
		return submission.stages.find((stage) => stage.isActiveStage);
	}

	/**
	 * Get a stage by its ID
	 * @param {Object} submission - The submission object
	 * @param {number} stageId - The stage ID to find
	 * @returns {Object|undefined} The stage object or undefined
	 */
	function getStageById(submission, stageId) {
		return submission.stages.find((stage) => stage.id === stageId);
	}

	/**
	 * Find a submission by its ID
	 * @param {Array<Object>} submissions - Array of submissions
	 * @param {number} submissionId - The submission ID to find
	 * @returns {Object|undefined} The submission object or undefined
	 */
	function getSubmissionById(submissions, submissionId) {
		return submissions.find((submission) => submission.id === submissionId);
	}

	/**
	 * Get review assignments for a specific round
	 * @param {Array<Object>} reviewAssignments - Array of review assignments
	 * @param {number} roundId - The review round ID
	 * @returns {Array<Object>} Filtered array of review assignments
	 */
	function getReviewAssignmentsForRound(reviewAssignments, roundId) {
		return reviewAssignments.filter(
			(reviewAssignment) => reviewAssignment.roundId === roundId,
		);
	}

	/**
	 * Get the current (most recent) review round for a submission
	 * @param {Object} submission - The submission object
	 * @param {number} [stageId=pkp.const.WORKFLOW_STAGE_ID_EXTERNAL_REVIEW] - The stage ID
	 * @returns {Object|null} The review round or null
	 */
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

	/**
	 * Get a specific review round by ID
	 * @param {Object} submission - The submission object
	 * @param {number} reviewRoundId - The review round ID
	 * @returns {Object|undefined} The review round or undefined
	 */
	function getReviewRound(submission, reviewRoundId) {
		return submission?.reviewRounds.find(
			(reviewRound) => reviewRound.id === reviewRoundId,
		);
	}

	/**
	 * Get all review rounds for a specific stage
	 * @param {Object} submission - The submission object
	 * @param {number} stageId - The stage ID
	 * @returns {Array<Object>} Array of review rounds
	 */
	function getReviewRoundsForStage(submission, stageId) {
		return submission?.reviewRounds.filter(
			(reviewRound) => reviewRound.stageId === stageId,
		);
	}

	/**
	 * Get review assignments for the current review round
	 * @param {Object} submission - The submission object
	 * @param {number} stageId - The stage ID
	 * @returns {Array<Object>} Array of review assignments
	 */
	function getCurrentReviewAssignments(submission, stageId) {
		const currentReviewRound = getCurrentReviewRound(submission, stageId);

		return submission.reviewAssignments.filter(
			(reviewAssignment) => reviewAssignment.round === currentReviewRound.round,
		);
	}

	/**
	 * Get the current publication for a submission
	 * @param {Object} submission - The submission object
	 * @returns {Object|undefined} The current publication or undefined
	 */
	function getCurrentPublication(submission) {
		return submission.publications.find(
			(publication) => publication.id === submission.currentPublicationId,
		);
	}

	/**
	 * Get the latest publication for a submission
	 * @param {Object} submission - The submission object
	 * @returns {Object} The latest publication
	 */
	function getLatestPublication(submission) {
		return submission.publications.reduce(
			(latestPublication, publication) =>
				publication.id > latestPublication.id ? publication : latestPublication,
			submission.publications[0],
		);
	}

	/**
	 * Get the extended stage for a submission
	 * @param {Object} submission - The submission object
	 * @returns {string} The extended stage identifier
	 */
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

	/**
	 * Get a localized label for the submission's extended stage
	 * @param {Object} submission - The submission object
	 * @returns {string} Localized stage label
	 */
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

	/**
	 * Get a localized label for the submission's current stage
	 * @param {Object} submission - The submission object
	 * @returns {string} Localized stage label
	 */
	function getStageLabel(submission) {
		return t(StageLabels[submission.stageId]);
	}

	/**
	 * Check if the submission has passed a specific stage
	 * @param {Object} submission - The submission object
	 * @param {number} stageId - The stage ID to check
	 * @returns {boolean} True if the submission has passed the stage
	 */
	function hasSubmissionPassedStage(submission, stageId) {
		return submission.stageId > stageId;
	}

	/**
	 * Check if the submission has not yet started a specific stage
	 * @param {Object} submission - The submission object
	 * @param {number} stageId - The stage ID to check
	 * @returns {boolean} True if the submission has not started the stage
	 */
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

	/**
	 * Get active review assignments (not declined or cancelled)
	 * @param {Array<Object>} reviewAssignments - Array of review assignments
	 * @returns {Array<Object>} Filtered array of review assignments
	 */
	function getActiveReviewAssignments(reviewAssignments) {
		return reviewAssignments.filter(
			(reviewAssignment) =>
				!IgnoredReviewAssignmentStatuses.includes(reviewAssignment.statusId),
		);
	}

	/**
	 * Get completed review assignments
	 * @param {Array<Object>} [reviewAssignments=[]] - Array of review assignments
	 * @returns {Array<Object>} Filtered array of review assignments
	 */
	function getCompletedReviewAssignments(reviewAssignments = []) {
		return getActiveReviewAssignments(reviewAssignments).filter(
			(reviewAssignment) =>
				CompletedReviewAssignmentStatuses.includes(reviewAssignment.statusId),
		);
	}

	/**
	 * Get confirmed review assignments (complete or thanked)
	 * @param {Array<Object>} [reviewAssignments=[]] - Array of review assignments
	 * @returns {Array<Object>} Filtered array of review assignments
	 */
	function getConfirmedReviewAssignments(reviewAssignments = []) {
		return getActiveReviewAssignments(reviewAssignments).filter(
			(reviewAssignment) =>
				ConfirmedReviewAssignmentStatuses.includes(reviewAssignment.statusId),
		);
	}

	/**
	 * Get open review assignments
	 * @param {Array<Object>} reviewAssignments - Array of review assignments
	 * @returns {Array<Object>} Filtered array of review assignments
	 */
	function getOpenReviewAssignments(reviewAssignments) {
		return reviewAssignments.filter(
			(reviewAssignment) =>
				reviewAssignment.reviewMethod ===
				pkp.const.SUBMISSION_REVIEW_METHOD_OPEN,
		);
	}

	/**
	 * Get open review assignments for a specific round
	 * @param {Array<Object>} reviewAssignments - Array of review assignments
	 * @param {number} reviewRoundId - The review round ID
	 * @returns {Array<Object>} Filtered array of review assignments
	 */
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

	/**
	 * Get open and completed review assignments for a specific round
	 * @param {Array<Object>} reviewAssignments - Array of review assignments
	 * @param {number} reviewRoundId - The review round ID
	 * @returns {Array<Object>} Filtered array of review assignments
	 */
	function getOpenAndCompletedReviewAssignmentsForRound(
		reviewAssignments,
		reviewRoundId,
	) {
		return getOpenReviewAssignmentsForRound(
			reviewAssignments,
			reviewRoundId,
		).filter((reviewAssignment) => !!reviewAssignment.dateCompleted);
	}

	/**
	 * Check if a decision is available for the submission
	 * @param {Object} submission - The submission object
	 * @param {number} decisionId - The decision ID to check
	 * @returns {boolean} True if the decision is available
	 */
	function isDecisionAvailable(submission, decisionId) {
		const stage = getActiveStage(submission);
		return submission?.availableEditorialDecisions?.some(
			(decision) => decision.id === decisionId && decision.stageId === stage.id,
		);
	}

	/**
	 * Check if the minimum number of reviews has been reached
	 * @param {Object} submission - The submission object
	 * @param {number} stageId - The stage ID
	 * @param {number} reviewRoundId - The review round ID
	 * @param {number} minReviewsCount - The minimum number of reviews required
	 * @returns {Object} Object with flags indicating review status
	 */
	function checkMinimumConsideredReviews(
		submission,
		stageId,
		reviewRoundId,
		minReviewsCount,
	) {
		if (
			!minReviewsCount ||
			stageId !== pkp.const.WORKFLOW_STAGE_ID_EXTERNAL_REVIEW
		) {
			return {
				shouldMinimumReviewsBeConsidered: false,
				hasMinimumReviewsCount: false,
			};
		}
		const reviewAssignments = getReviewAssignmentsForRound(
			submission.reviewAssignments,
			reviewRoundId,
		);

		const confirmedReviewAssignments =
			getConfirmedReviewAssignments(reviewAssignments);

		const hasMinimumReviewsCount =
			confirmedReviewAssignments.length >= minReviewsCount;

		return {
			shouldMinimumReviewsBeConsidered: true,
			hasMinimumReviewsCount,
		};
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
		getConfirmedReviewAssignments,
		getCompletedReviewAssignments,
		checkMinimumConsideredReviews,
		getOpenReviewAssignments,
		getOpenReviewAssignmentsForRound,
		getOpenAndCompletedReviewAssignmentsForRound,
		InProgressReviewAssignmentStatuses,
		isDecisionAvailable,
	};
}
