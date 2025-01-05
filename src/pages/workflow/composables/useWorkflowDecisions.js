import {useUrlSearchParams} from '@vueuse/core';
import {useUrl} from '@/composables/useUrl';

export const Actions = {
	DECISION_ACCEPT: 'decisionAccept',
	DECISION_CANCEL_REVIEW_ROUND: 'decisionCancelReviewRound',
	DECISION_DECLINE: 'decisionDecline',
	DECISION_EXTERNAL_REVIEW: 'decisionExternalReview',
	DECISION_SKIP_EXTERNAL_REVIEW: 'decisionSkipExternalReview',
	DECISION_INITIAL_DECLINE: 'decisionInitialDecline',
	DECISION_REVERT_DECLINE: 'decisionRevertDecline',
	DECISION_REVERT_INITIAL_DECLINE: 'decisionRevertInitialDecline',

	DECISION_SEND_TO_PRODUCTION: 'decisionSendToProduction',
	DECISION_BACK_FROM_COPYEDITING: 'decisionBackFromCopyediting',
	DECISION_NEW_EXTERNAL_ROUND: 'decisionNewExternalRound',
	DECISION_BACK_FROM_PRODUCTION: 'decisionBackFromProduction',
	DECISION_RECOMMEND_ACCEPT: 'decisionRecommendAccept',
	DECISION_RECOMMEND_DECLINE: 'decisionRecommendDecline',
	// OMP SPECIFIC
	DECISION_INTERNAL_REVIEW: 'decisionInternalReview',
	DECISION_RECOMMEND_EXTERNAL_REVIEW: 'decisionRecommendExternalReview',
	DECISION_SKIP_INTERNAL_REVIEW: 'decisionSkipInternalReview',
	DECISION_ACCEPT_INTERNAL: 'decisionAcceptInternal',
	DECISION_PENDING_REVISIONS_INTERNAL: 'decisionPendingRevisionsInternal',
	DECISION_RESUBMIT_INTERNAL: 'decisionResubmitInternal',
	DECISION_DECLINE_INTERNAL: 'decisionDeclineInternal',
	DECISION_RECOMMEND_ACCEPT_INTERNAL: 'decisionRecommendAcceptInternal',
	DECISION_RECOMMEND_PENDING_REVISIONS_INTERNAL:
		'decisionRecommendPendingRevisionsInternal',
	DECISION_RECOMMEND_RESUBMIT_INTERNAL: 'decisionRecommendResubmitInternal',
	DECISION_RECOMMEND_DECLINE_INTERNAL: 'decisionRecommendDeclineInternal',
	DECISION_REVERT_INTERNAL_DECLINE: 'decisionRevertInternalDecline',
	DECISION_NEW_INTERNAL_ROUND: 'decisionNewInternalRound',
	DECISION_CANCEL_INTERNAL_REVIEW_ROUND: 'decisionCancelInternalReviewRound',
};

function openDecisionPage(submission, decisionId, actionArgs = {}) {
	const queryParamsUrl = useUrlSearchParams();

	const urlSearchParams = new URLSearchParams({
		...queryParamsUrl,
		workflowSubmissionId: submission.id,
	});

	// Given that decision often change the stage - its better to let workflow page to calculate current stage
	urlSearchParams.delete('workflowMenuKey');

	const currentPageUrl = `dashboard/editorial?${urlSearchParams.toString()}`;

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

	function decisionDecline({submission, reviewRoundId}) {
		openDecisionPage(submission, pkp.const.DECISION_DECLINE, {
			reviewRoundId,
		});
	}

	function decisionRevertDecline({submission, reviewRoundId}) {
		openDecisionPage(submission, pkp.const.DECISION_REVERT_DECLINE, {
			reviewRoundId,
		});
	}

	function decisionExternalReview({submission, reviewRoundId}) {
		openDecisionPage(submission, pkp.const.DECISION_EXTERNAL_REVIEW, {
			reviewRoundId,
		});
	}

	function decisionSkipExternalReview({submission}) {
		openDecisionPage(submission, pkp.const.DECISION_SKIP_EXTERNAL_REVIEW);
	}

	function decisionInitialDecline({submission}) {
		openDecisionPage(submission, pkp.const.DECISION_INITIAL_DECLINE);
	}

	function decisionRevertInitialDecline({submission}) {
		openDecisionPage(submission, pkp.const.DECISION_REVERT_INITIAL_DECLINE);
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

	// OMP Specific

	function decisionInternalReview({submission}) {
		openDecisionPage(submission, pkp.const.DECISION_INTERNAL_REVIEW);
	}

	function decisionRecommendExternalReview({submission, reviewRoundId}) {
		openDecisionPage(submission, pkp.const.DECISION_RECOMMEND_EXTERNAL_REVIEW, {
			reviewRoundId,
		});
	}

	function decisionSkipInternalReview({submission}) {
		openDecisionPage(submission, pkp.const.DECISION_SKIP_INTERNAL_REVIEW);
	}

	function decisionAcceptInternal({submission, reviewRoundId}) {
		openDecisionPage(submission, pkp.const.DECISION_ACCEPT_INTERNAL, {
			reviewRoundId,
		});
	}

	function decisionPendingRevisionsInternal({submission, reviewRoundId}) {
		openDecisionPage(
			submission,
			pkp.const.DECISION_PENDING_REVISIONS_INTERNAL,
			{
				reviewRoundId,
			},
		);
	}

	function decisionResubmitInternal({submission, reviewRoundId}) {
		openDecisionPage(submission, pkp.const.DECISION_RESUBMIT_INTERNAL, {
			reviewRoundId,
		});
	}

	function decisionDeclineInternal({submission, reviewRoundId}) {
		openDecisionPage(submission, pkp.const.DECISION_DECLINE_INTERNAL, {
			reviewRoundId,
		});
	}

	function decisionRecommendAcceptInternal({submission, reviewRoundId}) {
		openDecisionPage(submission, pkp.const.DECISION_RECOMMEND_ACCEPT_INTERNAL, {
			reviewRoundId,
		});
	}

	function decisionRecommendPendingRevisionsInternal({
		submission,
		reviewRoundId,
	}) {
		openDecisionPage(
			submission,
			pkp.const.DECISION_RECOMMEND_PENDING_REVISIONS_INTERNAL,
			{
				reviewRoundId,
			},
		);
	}

	function decisionRecommendResubmitInternal({submission, reviewRoundId}) {
		openDecisionPage(
			submission,
			pkp.const.DECISION_RECOMMEND_RESUBMIT_INTERNAL,
			{
				reviewRoundId,
			},
		);
	}

	function decisionRecommendDeclineInternal({submission, reviewRoundId}) {
		openDecisionPage(
			submission,
			pkp.const.DECISION_RECOMMEND_DECLINE_INTERNAL,
			{
				reviewRoundId,
			},
		);
	}

	function decisionRevertInternalDecline({submission, reviewRoundId}) {
		openDecisionPage(submission, pkp.const.DECISION_REVERT_INTERNAL_DECLINE, {
			reviewRoundId,
		});
	}

	function decisionNewInternalRound({submission, reviewRoundId}) {
		openDecisionPage(submission, pkp.const.DECISION_NEW_INTERNAL_ROUND, {
			reviewRoundId,
		});
	}

	function decisionCancelInternalReviewRound({submission, reviewRoundId}) {
		openDecisionPage(
			submission,
			pkp.const.DECISION_CANCEL_INTERNAL_REVIEW_ROUND,
			{
				reviewRoundId,
			},
		);
	}

	return {
		openDecisionPage,
		decisionAccept,
		decisionCancelReviewRound,
		decisionDecline,
		decisionRevertDecline,
		decisionExternalReview,
		decisionSkipExternalReview,
		decisionInitialDecline,
		decisionRevertInitialDecline,
		decisionSendToProduction,
		decisionBackFromCopyediting,
		decisionNewExternalRound,
		decisionBackFromProduction,
		decisionRecommendAccept,
		decisionRecommendDecline,
		// OMP
		decisionInternalReview,
		decisionRecommendExternalReview,
		decisionSkipInternalReview,
		decisionAcceptInternal,
		decisionPendingRevisionsInternal,
		decisionResubmitInternal,
		decisionDeclineInternal,
		decisionRecommendAcceptInternal,
		decisionRecommendPendingRevisionsInternal,
		decisionRecommendResubmitInternal,
		decisionRecommendDeclineInternal,
		decisionRevertInternalDecline,
		decisionNewInternalRound,
		decisionCancelInternalReviewRound,
	};
}
