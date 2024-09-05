import {computed} from 'vue';
import {defineComponentStore} from '@/utils/defineComponentStore';
import {useReviewAssignment} from '@/composables/useReviewAssignment';
import {useSubmission} from '@/composables/useSubmission';
import {useReviewerManagerActions} from './useReviewerManagerActions';
import {useDataChanged} from '@/composables/useDataChanged';

export const useReviewerManagerStore = defineComponentStore(
	'reviewerManagerStore',
	(props) => {
		const {getReviewMethodIcons, getOpenReviewAssignments} =
			useReviewAssignment();

		const {getReviewAssignmentsForRound} = useSubmission();

		const reviewAssignments = computed(() => {
			const reviewAssignmentsForSelectedRound = getReviewAssignmentsForRound(
				props.submission,
				props.reviewRoundId,
			);

			if (props.redactedForAuthors) {
				return getOpenReviewAssignments(reviewAssignmentsForSelectedRound);
			}

			return reviewAssignmentsForSelectedRound;
		});

		const {triggerDataChange} = useDataChanged();

		const _actionFns = useReviewerManagerActions();

		const topActions = computed(() =>
			_actionFns.getTopActions({submission: props.submission}),
		);

		function handleAction(actionName, args) {
			_actionFns.handleAction(
				actionName,
				{
					submission: props.submission,
					reviewRoundId: props.reviewRoundId,
					submissionStageId: props.submission.stageId,
					...args,
				},
				() => {
					triggerDataChange();
				},
			);
		}

		function getItemActions(args) {
			return _actionFns.getItemActions(args);
		}

		return {
			getReviewMethodIcons,
			reviewAssignments,
			topActions,
			handleAction,
			getItemActions,
			_actionFns,
		};
	},
);
