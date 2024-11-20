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
			return `submissions/${encodeURIComponent(submissionId.value)}/reviewers/suggestions?approved=false`;
		});

		const {apiUrl: reviewerSuggestionApiUrl} = useUrl(relativeUrl);

		const {data: reviewerSuggestions, fetch: fetchreviewerSuggestion} =
			useFetch(reviewerSuggestionApiUrl);

		watch(relativeUrl, () => {
			reviewerSuggestions.value = null;
			fetchreviewerSuggestion();
		});

		fetchreviewerSuggestion();

		const {triggerDataChange} = useDataChanged(() => fetchreviewerSuggestion());

		function triggerDataChangeCallback() {
			triggerDataChange();
		}

		const reviewerSuggestionsList = computed(() => {
			if (!reviewerSuggestions.value) {
				return [];
			}

			const list = [];

			reviewerSuggestions.value.items.forEach((reviewerSuggestion) => {
				list.push({
					id: reviewerSuggestion.id,
					fullName: localize(reviewerSuggestion.fullName),
					affiliation: localize(reviewerSuggestion.affiliation),
					suggestionReason: localize(reviewerSuggestion.suggestionReason),
				});
			});

			return list;
		});

		/**
		 * Handling actions
		 */

		const _actionFns = useReviewerSuggestionManagerActions();

		const itemActions = computed(() => _actionFns.getItemActions({}));

		const hasActiveReviewStage = props.reviewRoundId ? true : false;

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
			hasActiveReviewStage,
		};
	},
);
