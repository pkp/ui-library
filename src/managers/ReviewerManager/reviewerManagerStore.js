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

		/**
		 * Actions
		 */
		const _actionFns = useReviewerManagerActions();

		const topActions = computed(() =>
			_actionFns.getTopActions({submission: props.submission}),
		);

		function dataUpdateCallback() {
			triggerDataChange();
		}

		function getActionArgs(additionalArgs = {}) {
			return {
				submission: props.submission,
				submissionStageId: props.submission.stageId,
				reviewRoundId: props.reviewRoundId,
				...additionalArgs,
			};
		}

		function reviewerAddReviewer() {
			_actionFns.reviewerAddReviewer(getActionArgs(), dataUpdateCallback);
		}

		function reviewerReadReview({reviewAssignment}) {
			_actionFns.reviewerReadReview(
				getActionArgs({reviewAssignment}),
				dataUpdateCallback,
			);
		}

		function reviewerReviewDetails({reviewAssignment}) {
			_actionFns.reviewerReviewDetails(
				getActionArgs({reviewAssignment}),
				dataUpdateCallback,
			);
		}

		function reviewerEmailReviewer({reviewAssignment}) {
			_actionFns.reviewerEmailReviewer(
				getActionArgs({reviewAssignment}),
				dataUpdateCallback,
			);
		}

		function reviewerEditReview({reviewAssignment}) {
			_actionFns.reviewerEditReview(
				getActionArgs({reviewAssignment}),
				dataUpdateCallback,
			);
		}

		function reviewerUnassignReviewer({reviewAssignment}) {
			_actionFns.reviewerUnassignReviewer(
				getActionArgs({reviewAssignment}),
				dataUpdateCallback,
			);
		}

		function reviewerCancelReviewer({reviewAssignment}) {
			_actionFns.reviewerCancelReviewer(
				getActionArgs({reviewAssignment}),
				dataUpdateCallback,
			);
		}

		function reviewerReviewHistory({reviewAssignment}) {
			_actionFns.reviewerReviewHistory(
				getActionArgs({reviewAssignment}),
				dataUpdateCallback,
			);
		}

		function reviewerLoginAs({reviewAssignment}) {
			_actionFns.reviewerReviewHistory(
				getActionArgs({reviewAssignment}),
				dataUpdateCallback,
			);
		}

		function reviewerEditorialNotes({reviewAssignment}) {
			_actionFns.reviewerEditorialNotes(
				getActionArgs({reviewAssignment}),
				dataUpdateCallback,
			);
		}

		function reviewerThankReviewer({reviewAssignment}) {
			_actionFns.reviewerThankReviewer(
				getActionArgs({reviewAssignment}),
				dataUpdateCallback,
			);
		}

		function reviewerRevertConsider({reviewAssignment}) {
			_actionFns.reviewerRevertConsider(
				getActionArgs({reviewAssignment}),
				dataUpdateCallback,
			);
		}

		function reviewerSendReminder({reviewAssignment}) {
			_actionFns.reviewerRevertConsider(
				getActionArgs({reviewAssignment}),
				dataUpdateCallback,
			);
		}

		function getItemActions(args) {
			return _actionFns.getItemActions(args);
		}

		function getItemPrimaryActions(args) {
			return _actionFns.getItemPrimaryActions(args);
		}

		return {
			getReviewMethodIcons,
			reviewAssignments,

			/** Actions */
			topActions,
			getItemActions,
			getItemPrimaryActions,
			reviewerAddReviewer,
			reviewerReadReview,
			reviewerReviewDetails,
			reviewerEmailReviewer,
			reviewerEditReview,
			reviewerUnassignReviewer,
			reviewerCancelReviewer,
			reviewerReviewHistory,
			reviewerLoginAs,
			reviewerEditorialNotes,
			reviewerThankReviewer,
			reviewerRevertConsider,
			reviewerSendReminder,
			_reviewerManagerActionFns: _actionFns,
		};
	},
);
