import {useLegacyGridUrl} from '@/composables/useLegacyGridUrl';
import {useLocalize} from '@/composables/useLocalize';

export const Actions = {
	REVIEWER_SUGGESTION_APPROVE: 'reviewerSuggestionApprove',
};

export function useReviewerSuggestionManagerActions() {
	const {t} = useLocalize();

	function reviewerSuggestionApprove(
		{submissionStageId, submission, reviewRoundId, reviewerSuggestion},
		finishedCallback,
	) {
		const {openLegacyModal} = useLegacyGridUrl({
			component: 'grid.users.reviewer.ReviewerGridHandler',
			op: 'showReviewerForm',
			params: {
				submissionId: submission.id,
				stageId: submissionStageId,
				reviewRoundId: reviewRoundId,
				selectionType: pkp.const.REVIEWER_SELECT_CREATE,
				reviewerSuggestionId: reviewerSuggestion.id,
			},
		});

		openLegacyModal(
			{title: t('editor.submission.addReviewer')},
			finishedCallback,
		);
	}

	function getItemActions() {
		const {t} = useLocalize();
		const actions = [];

		actions.push({
			label: t('editor.submission.addReviewer'),
			name: Actions.REVIEWER_SUGGESTION_APPROVE,
			icon: 'Add',
		});

		return actions;
	}

	return {
		getItemActions,
		reviewerSuggestionApprove,
	};
}
