import {defineComponentStore} from '@/utils/defineComponentStore';

import {ref, computed, watch} from 'vue';

import {useFetch} from '@/composables/useFetch';
import {useUrl} from '@/composables/useUrl';

import {useLocalize} from '@/composables/useLocalize';
import {useReviewerSuggestionManagerActions} from './useReviewerSuggestionManagerActions';
import {useDataChanged} from '@/composables/useDataChanged';

export const useReviewerSuggestionManagerStore = defineComponentStore(
	'reviewerSuggestionManager',
	(props) => {
		const {localize} = useLocalize();

		const submissionId = ref(props.submission.id);

		const relativeUrl = computed(() => {
			if (props.reviewRoundId) {
				return `submissions/${encodeURIComponent(submissionId.value)}/reviewers/suggestions?approved=false`;
			}
			return `submissions/${encodeURIComponent(submissionId.value)}/reviewers/suggestions`;
		});

		const {apiUrl: reviewerSuggestionApiUrl} = useUrl(relativeUrl);

		const {data: reviewerSuggestions, fetch: fetchReviewerSuggestion} =
			useFetch(reviewerSuggestionApiUrl);

		watch(relativeUrl, () => {
			reviewerSuggestions.value = null;
			fetchReviewerSuggestion();
		});

		fetchReviewerSuggestion();

		const {triggerDataChange} = useDataChanged(() => fetchReviewerSuggestion());

		function triggerDataChangeCallback() {
			triggerDataChange();
		}

		const reviewerSuggestionsList = computed(() => {
			if (!reviewerSuggestions.value) {
				return [];
			}

			const list = [];

			reviewerSuggestions.value.items
				.filter((reviewerSuggestion) =>
					props.reviewRoundId ? !reviewerSuggestion.reviewerId : true,
				)
				.forEach((reviewerSuggestion) => {
					list.push({
						id: reviewerSuggestion.id,
						fullName: localize(reviewerSuggestion.fullName),
						displayInitial: localize(reviewerSuggestion.displayInitial),
						affiliation: localize(reviewerSuggestion.affiliation),
						suggestionReason: localize(reviewerSuggestion.suggestionReason),
						existingReviewerRole: reviewerSuggestion.existingReviewerRole,
						existingUserId: reviewerSuggestion.existingUserId,
					});
				});

			return list;
		});

		/**
		 * Handling actions
		 */

		const _actionFns = useReviewerSuggestionManagerActions();

		const itemActions = computed(() => _actionFns.getItemActions({}));

		function atActiveReviewStage() {
			return (
				props.reviewRoundId &&
				props.submissionStageId ===
					pkp.const.WORKFLOW_STAGE_ID_EXTERNAL_REVIEW &&
				props.submissionStageId === props.submission.stageId
			);
		}

		function enrichActionArg(args) {
			return {
				submissionStageId: props.submissionStageId,
				submission: props.submission,
				reviewRoundId: props.reviewRoundId,
				...args,
			};
		}

		function reviewerSuggestionApprove({reviewerSuggestion}) {
			_actionFns.reviewerSuggestionApprove(
				enrichActionArg({reviewerSuggestion}),
				triggerDataChangeCallback,
			);
		}

		return {
			reviewerSuggestionsList,
			_actionFns,
			itemActions,
			reviewerSuggestionApprove,
			atActiveReviewStage,
		};
	},
);
