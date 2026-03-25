import {computed} from 'vue';
import {defineComponentStore} from '@/utils/defineComponentStore';
import {useSubmission} from '@/composables/useSubmission';
import {useReviewerManagerActions} from './useReviewerManagerActions';
import {useReviewerManagerConfig} from './useReviewerManagerConfig';
import {useDataChanged} from '@/composables/useDataChanged';
import {useExtender} from '@/composables/useExtender';

export const useReviewerManagerStore = defineComponentStore(
	'reviewerManager',
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
		const reviewerManagerConfig = extender.addFns(
			useReviewerManagerConfig({recommendations: props.recommendations}),
		);

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

		function getActionArgs(additionalArgs = {}) {
			return {
				submission: props.submission,
				submissionStageId: props.submissionStageId,
				reviewRoundId: props.reviewRoundId,
				componentForms: props.componentForms,
				...additionalArgs,
			};
		}

		function reviewerAddReviewer() {
			reviewerManagerActions.reviewerAddReviewer(
				getActionArgs(),
				triggerDataChange,
			);
		}

		function reviewerReadReview({reviewAssignment}) {
			reviewerManagerActions.reviewerReadReview(
				getActionArgs({reviewAssignment}),
				triggerDataChange,
			);
		}

		function reviewerReadReviewByAuthor({reviewAssignment}) {
			reviewerManagerActions.reviewerReadReviewByAuthor(
				getActionArgs({reviewAssignment}),
				triggerDataChange,
			);
		}

		function reviewerReviewDetails({reviewAssignment}) {
			reviewerManagerActions.reviewerReviewDetails(
				getActionArgs({reviewAssignment}),
				triggerDataChange,
			);
		}

		function reviewerEmailReviewer({reviewAssignment}) {
			reviewerManagerActions.reviewerEmailReviewer(
				getActionArgs({reviewAssignment}),
				triggerDataChange,
			);
		}

		function reviewerResendRequest({reviewAssignment}) {
			reviewerManagerActions.reviewerResendRequest(
				getActionArgs({reviewAssignment}),
				triggerDataChange,
			);
		}

		function reviewerEditReview({reviewAssignment}) {
			reviewerManagerActions.reviewerEditReview(
				getActionArgs({reviewAssignment}),
				triggerDataChange,
			);
		}

		function reviewerUnassignReviewer({reviewAssignment}) {
			reviewerManagerActions.reviewerUnassignReviewer(
				getActionArgs({reviewAssignment}),
				triggerDataChange,
			);
		}

		function reviewerReinstateReviewer({reviewAssignment}) {
			reviewerManagerActions.reviewerReinstateReviewer(
				getActionArgs({reviewAssignment}),
				triggerDataChange,
			);
		}

		function reviewerCancelReviewer({reviewAssignment}) {
			reviewerManagerActions.reviewerCancelReviewer(
				getActionArgs({reviewAssignment}),
				triggerDataChange,
			);
		}

		function reviewerReviewHistory({reviewAssignment}) {
			reviewerManagerActions.reviewerReviewHistory(
				getActionArgs({reviewAssignment}),
				triggerDataChange,
			);
		}

		function reviewerLoginAs({reviewAssignment}) {
			reviewerManagerActions.reviewerLoginAs(
				getActionArgs({reviewAssignment}),
				triggerDataChange,
			);
		}

		function reviewerEditorialNotes({reviewAssignment}) {
			reviewerManagerActions.reviewerEditorialNotes(
				getActionArgs({reviewAssignment}),
				triggerDataChange,
			);
		}

		function reviewerThankReviewer({reviewAssignment}) {
			reviewerManagerActions.reviewerThankReviewer(
				getActionArgs({reviewAssignment}),
				triggerDataChange,
			);
		}

		function reviewerRevertConsider({reviewAssignment}) {
			reviewerManagerActions.reviewerRevertConsider(
				getActionArgs({reviewAssignment}),
				triggerDataChange,
			);
		}

		function reviewerSendReminder({reviewAssignment}) {
			reviewerManagerActions.reviewerSendReminder(
				getActionArgs({reviewAssignment}),
				triggerDataChange,
			);
		}

		function reviewerLogResponse({reviewAssignment}) {
			reviewerManagerActions.reviewerLogResponse(
				getActionArgs({reviewAssignment}),
				triggerDataChange,
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
			reviewerResendRequest,
			reviewerEditReview,
			reviewerUnassignReviewer,
			reviewerReinstateReviewer,
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
			props,
		};
	},
);
