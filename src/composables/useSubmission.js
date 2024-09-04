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

export function useSubmission() {
	function getActiveStage(submission) {
		return submission.stages.find((stage) => stage.isActiveStage);
	}

	function getReviewAssignmentsForRound(submission, roundId) {
		return submission.reviewAssignments.filter(
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

	return {
		getActiveStage,
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
		getReviewAssignmentsForRound,
	};
}
