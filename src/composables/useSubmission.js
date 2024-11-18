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
	submission: tk('dashboard.stage.submission'),
	internalReview: tk('todo'),
	externalReview: tk('dashboard.stage.reviewWithRound'),
	editing: tk('dashboard.stage.copyediting'),
	productionQueued: tk('dashboard.stage.production'),
	productionScheduled: tk('dashboard.stage.scheduledForPublication'),
	productionPublished: tk('dashboard.stage.published'),
	declined: tk('submissions.declined'),
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
const CompletedReviewAssignmentStatuses = [
	pkp.const.REVIEW_ASSIGNMENT_STATUS_RECEIVED,
	pkp.const.REVIEW_ASSIGNMENT_STATUS_COMPLETE,
	pkp.const.REVIEW_ASSIGNMENT_STATUS_THANKED,
	pkp.const.REVIEW_ASSIGNMENT_STATUS_CANCELLED,
	pkp.const.REVIEW_ASSIGNMENT_STATUS_REQUEST_RESEND,
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

	function getCurrentReviewAssignments(submission) {
		const currentReviewRound = getCurrentReviewRound(submission);

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
		const round =
			extendedStage === ExtendedStages.EXTERNAL_REVIEW
				? submission.reviewRounds[submission.reviewRounds.length - 1].round
				: undefined;
		return t(ExtendedStagesLabels[extendedStage], {
			round,
		});
	}

	function getFileStageFromWorkflowStage(submission) {
		const FileStageMapping = {
			[pkp.const.WORKFLOW_STAGE_ID_SUBMISSION]:
				pkp.const.SUBMISSION_FILE_SUBMISSION,
			[pkp.const.WORKFLOW_STAGE_ID_EXTERNAL_REVIEW]:
				pkp.const.SUBMISSION_FILE_REVIEW_REVISION,
			[pkp.const.WORKFLOW_STAGE_ID_EDITING]: pkp.const.SUBMISSION_FILE_FINAL,
		};

		return FileStageMapping[submission.stageId];
	}

	function hasSubmissionPassedStage(submission, stageId) {
		return submission.stageId > stageId;
	}

	function hasNotSubmissionStartedStage(submission, stageId) {
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

	function getReviewMethodIcons(reviewAssignment) {
		switch (reviewAssignment.reviewMethod) {
			case pkp.const.SUBMISSION_REVIEW_METHOD_ANONYMOUS:
				return ['OpenReview', 'AnonymousReview'];
			case pkp.const.SUBMISSION_REVIEW_METHOD_DOUBLEANONYMOUS:
				return ['AnonymousReview', 'AnonymousReview'];
			case pkp.const.SUBMISSION_REVIEW_METHOD_OPEN:
				return ['OpenReview', 'OpenReview'];
		}

		return ['OpenReview', 'OpenReview'];
	}

	function getRecommendOnlyUserIdsForStage(submission, stageId) {
		const stage = getStageById(submission, stageId);

		return stage.stageAssignments
			.filter((assignment) => assignment.recommendOnly)
			.map((assignment) => assignment.userId);
	}

	function isDecisionAvailable(submission, decisionId) {
		const stage = getActiveStage(submission);
		return stage?.availableEditorialDecisions?.some(
			(decision) => decision.id === decisionId,
		);
	}

	return {
		getSubmissionById,
		getActiveStage,
		getStageById,
		getExtendedStage,
		getExtendedStageLabel,
		getCurrentReviewRound,
		getReviewRound,
		getReviewRoundsForStage,
		getCurrentReviewAssignments,
		getCurrentPublication,
		getLatestPublication,
		getFileStageFromWorkflowStage,
		hasNotSubmissionStartedStage,
		hasSubmissionPassedStage,
		// review assignments
		getReviewAssignmentsForRound,
		getActiveReviewAssignments,
		getCompletedReviewAssignments,
		getOpenReviewAssignmentsForRound,
		getReviewMethodIcons,
		InProgressReviewAssignmentStatuses,
		getRecommendOnlyUserIdsForStage,
		isDecisionAvailable,
	};
}
