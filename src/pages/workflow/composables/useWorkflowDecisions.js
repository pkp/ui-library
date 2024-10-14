import {useUrlSearchParams} from '@vueuse/core';
import {useUrl} from '@/composables/useUrl';

export const Actions = {
	DECISION_ACCEPT: 'decisionAccept',
	DECISION_CANCEL_REVIEW_ROUND: 'decisionCancelReviewRound',
	DECISION_DECLINE_SUBMISSION: 'decisionDeclineSubmission',
	DECISION_EXTERNAL_REVIEW: 'decisionExternalReview',
	DECISION_SKIP_EXTERNAL_REVIEW: 'decisionSkipExternalReview',
	DECISION_INITIAL_DECLINE: 'decisionInitialDecline',
	DECISION_SEND_TO_PRODUCTION: 'decisionSendToProduction',
	DECISION_BACK_FROM_COPYEDITING: 'decisionBackFromCopyediting',
	DECISION_NEW_EXTERNAL_ROUND: 'decisionNewExternalRound',
	DECISION_BACK_FROM_PRODUCTION: 'decisionBackFromProduction',
	DECISION_RECOMMEND_ACCEPT: 'decisionRecommendAccept',
	DECISION_RECOMMEND_DECLINE: 'decisionRecommendDecline',
};

function openDecisionPage(submission, decisionId, actionArgs = {}) {
	const queryParamsUrl = useUrlSearchParams();

	const currentPageUrl = `dashboard/editorial?${new URLSearchParams({...queryParamsUrl, workflowSubmissionId: submission.id}).toString()}`;

	const queryParams = {decision: decisionId, ret: currentPageUrl};

	if (actionArgs?.reviewRoundId) {
		queryParams.reviewRoundId = actionArgs?.reviewRoundId;
	}

	if (actionArgs?.stageId) {
		queryParams.stageId = actionArgs?.stageId;
	}

	const {redirectToPage} = useUrl(
		`decision/record/${encodeURIComponent(submission.id)}`,
		queryParams,
	);

	redirectToPage();
}

export function useWorkflowDecisions() {
	function decisionAccept({submission, reviewRoundId}) {
		openDecisionPage(submission, pkp.const.DECISION_ACCEPT, {
			reviewRoundId,
		});
	}

	function decisionCancelReviewRound({submission, reviewRoundId}) {
		openDecisionPage(submission, pkp.const.DECISION_CANCEL_REVIEW_ROUND, {
			reviewRoundId,
		});
	}

	function decisionDeclineSubmission({submission, reviewRoundId}) {
		openDecisionPage(submission, pkp.const.DECISION_DECLINE, {
			reviewRoundId,
		});
	}

	function decisionExternalReview({submission}) {
		openDecisionPage(submission, pkp.const.DECISION_EXTERNAL_REVIEW);
	}

	function decisionSkipExternalReview({submission}) {
		openDecisionPage(submission, pkp.const.DECISION_SKIP_EXTERNAL_REVIEW);
	}

	function decisionInitialDecline({submission}) {
		openDecisionPage(submission, pkp.const.DECISION_INITIAL_DECLINE);
	}

	function decisionSendToProduction({submission}) {
		openDecisionPage(submission, pkp.const.DECISION_SEND_TO_PRODUCTION);
	}

	function decisionBackFromCopyediting({submission}) {
		openDecisionPage(submission, pkp.const.DECISION_BACK_FROM_COPYEDITING);
	}

	function decisionNewExternalRound({submission, reviewRoundId}) {
		openDecisionPage(submission, pkp.const.DECISION_NEW_EXTERNAL_ROUND, {
			reviewRoundId,
		});
	}

	function decisionBackFromProduction({submission}) {
		openDecisionPage(submission, pkp.const.DECISION_BACK_FROM_PRODUCTION);
	}

	function decisionRecommendAccept({submission, reviewRoundId}) {
		openDecisionPage(submission, pkp.const.DECISION_RECOMMEND_ACCEPT, {
			reviewRoundId,
		});
	}

	function decisionRecommendDecline({submission, reviewRoundId}) {
		openDecisionPage(submission, pkp.const.DECISION_RECOMMEND_DECLINE, {
			reviewRoundId,
		});
	}

	return {
		openDecisionPage,
		decisionAccept,
		decisionCancelReviewRound,
		decisionDeclineSubmission,
		decisionExternalReview,
		decisionSkipExternalReview,
		decisionInitialDecline,
		decisionSendToProduction,
		decisionBackFromCopyediting,
		decisionNewExternalRound,
		decisionBackFromProduction,
		decisionRecommendAccept,
		decisionRecommendDecline,
	};
}
