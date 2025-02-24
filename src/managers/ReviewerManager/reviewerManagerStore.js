import {computed} from 'vue';
import {defineComponentStore} from '@/utils/defineComponentStore';
import {useSubmission} from '@/composables/useSubmission';
import {useReviewerManagerActions} from './useReviewerManagerActions';
import {useReviewerManagerConfig} from './useReviewerManagerConfig';
import {useDataChanged} from '@/composables/useDataChanged';
import {useExtender} from '@/composables/useExtender';

export const useReviewerManagerStore = defineComponentStore(
	'reviewerManagerStore',
	(props) => {
		const {
			getOpenAndCompletedReviewAssignmentsForRound,
			getReviewAssignmentsForRound,
		} = useSubmission();

		const extender = useExtender();

		const reviewAssignments = computed(() => {
			const reviewAssignmentsForSelectedRound = getReviewAssignmentsForRound(
				props.submission.reviewAssignments,
				props.reviewRoundId,
			);

			if (props.redactedForAuthors) {
				return getOpenAndCompletedReviewAssignmentsForRound(
					props.submission.reviewAssignments,
					props.reviewRoundId,
				);
			}
			return reviewAssignmentsForSelectedRound;
		});

		const {triggerDataChange} = useDataChanged();

		/**
		 * Config
		 */
		const reviewerManagerConfig = extender.addFns(useReviewerManagerConfig());

		const columns = computed(() =>
			reviewerManagerConfig.getColumns({
				submission: props.submission,
				redactedForAuthors: props.redactedForAuthors,
			}),
		);

		function getCellStatusItems(args) {
			return reviewerManagerConfig.getCellStatusItems(args);
		}

		function getItemActions(args) {
			return reviewerManagerConfig.getItemActions(args);
		}

		function getItemPrimaryActions(args) {
			return reviewerManagerConfig.getItemPrimaryActions(args);
		}

		const topItems = computed(() =>
			reviewerManagerConfig.getTopItems({
				submission: props.submission,
				redactedForAuthors: props.redactedForAuthors,
			}),
		);

		/**
		 * Actions
		 */
		const reviewerManagerActions = useReviewerManagerActions();

		function dataUpdateCallback() {
			triggerDataChange();
		}

		function getActionArgs(additionalArgs = {}) {
			return {
				submission: props.submission,
				submissionStageId: props.submission.stageId,
				reviewRoundId: props.reviewRoundId,
				componentForms: props.componentForms,
				...additionalArgs,
			};
		}

		function reviewerAddReviewer() {
			reviewerManagerActions.reviewerAddReviewer(
				getActionArgs(),
				dataUpdateCallback,
			);
		}

		function reviewerReadReview({reviewAssignment}) {
			reviewerManagerActions.reviewerReadReview(
				getActionArgs({reviewAssignment}),
				dataUpdateCallback,
			);
		}

		function reviewerReadReviewByAuthor({reviewAssignment}) {
			reviewerManagerActions.reviewerReadReviewByAuthor(
				getActionArgs({reviewAssignment}),
				dataUpdateCallback,
			);
		}

		function reviewerReviewDetails({reviewAssignment}) {
			reviewerManagerActions.reviewerReviewDetails(
				getActionArgs({reviewAssignment}),
				dataUpdateCallback,
			);
		}

		function reviewerEmailReviewer({reviewAssignment}) {
			reviewerManagerActions.reviewerEmailReviewer(
				getActionArgs({reviewAssignment}),
				dataUpdateCallback,
			);
		}

		function reviewerEditReview({reviewAssignment}) {
			reviewerManagerActions.reviewerEditReview(
				getActionArgs({reviewAssignment}),
				dataUpdateCallback,
			);
		}

		function reviewerUnassignReviewer({reviewAssignment}) {
			reviewerManagerActions.reviewerUnassignReviewer(
				getActionArgs({reviewAssignment}),
				dataUpdateCallback,
			);
		}

		function reviewerCancelReviewer({reviewAssignment}) {
			reviewerManagerActions.reviewerCancelReviewer(
				getActionArgs({reviewAssignment}),
				dataUpdateCallback,
			);
		}

		function reviewerReviewHistory({reviewAssignment}) {
			reviewerManagerActions.reviewerReviewHistory(
				getActionArgs({reviewAssignment}),
				dataUpdateCallback,
			);
		}

		function reviewerLoginAs({reviewAssignment}) {
			reviewerManagerActions.reviewerLoginAs(
				getActionArgs({reviewAssignment}),
				dataUpdateCallback,
			);
		}

		function reviewerEditorialNotes({reviewAssignment}) {
			reviewerManagerActions.reviewerEditorialNotes(
				getActionArgs({reviewAssignment}),
				dataUpdateCallback,
			);
		}

		function reviewerThankReviewer({reviewAssignment}) {
			reviewerManagerActions.reviewerThankReviewer(
				getActionArgs({reviewAssignment}),
				dataUpdateCallback,
			);
		}

		function reviewerRevertConsider({reviewAssignment}) {
			reviewerManagerActions.reviewerRevertConsider(
				getActionArgs({reviewAssignment}),
				dataUpdateCallback,
			);
		}

		function reviewerSendReminder({reviewAssignment}) {
			reviewerManagerActions.reviewerSendReminder(
				getActionArgs({reviewAssignment}),
				dataUpdateCallback,
			);
		}

		function reviewerLogResponse({reviewAssignment}) {
			reviewerManagerActions.reviewerLogResponse(
				getActionArgs({reviewAssignment}),
				dataUpdateCallback,
			);
		}

		function reviewerSendToOrcid({reviewAssignment}) {
			return reviewerManagerActions.reviewerSendToOrcid(
				getActionArgs({reviewAssignment}),
			);
		}

		return {
			reviewAssignments,

			/** Config */
			getCellStatusItems,
			columns,
			getItemActions,
			getItemPrimaryActions,
			topItems,

			/** Actions */
			reviewerAddReviewer,
			reviewerReadReview,
			reviewerReadReviewByAuthor,
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
			reviewerLogResponse,
			reviewerSendToOrcid,

			/**
			 * Extender
			 */
			extender,
		};
	},
);
