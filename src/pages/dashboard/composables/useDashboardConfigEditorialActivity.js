import {
	useSubmission,
	CompletedReviewAssignmentStatuses,
} from '@/composables/useSubmission.js';
import {useCurrentUser} from '@/composables/useCurrentUser';

import {useLocalize} from '@/composables/useLocalize';
import {useDate} from '@/composables/useDate';
import {Actions as ParticipantManagerActions} from '@/managers/ParticipantManager/useParticipantManagerActions';
import {Actions as ReviewerManagerActions} from '@/managers/ReviewerManager/useReviewerManagerActions';
import {Actions as FileManagerActions} from '@/managers/FileManager/useFileManagerActions';

const {formatShortDate} = useDate();

const {t} = useLocalize();
const {
	getActiveStage,
	getCurrentReviewRound,
	getCurrentReviewAssignments,
	getActiveReviewAssignments,
	getReviewAssignmentsForRound,
	getStageLabel,
} = useSubmission();

const {
	hasCurrentUserAtLeastOneAssignedRoleInAnyStage,
	isCurrentUserAssignedAsReviewer,
} = useCurrentUser();

export function useDashboardConfigEditorialActivity() {
	function getEditorialActivityForEditorialDashboard(submission) {
		const activeStage = getActiveStage(submission);

		if (submission.status === pkp.const.STATUS_DECLINED) {
			return [
				{
					component: 'DashboardCellSubmissionActivityActionAlert',
					props: {
						alert: t('dashboard.declinedDuringStage', {
							stageName: getStageLabel(submission),
						}),
					},
				},
			];
		}

		// Not checking for submission stage, as OPS does not have it
		if (submission.submissionProgress) {
			return [
				{
					component: 'DashboardCellSubmissionActivityActionAlert',
					props: {
						actionName: 'openSubmissionWizard',
						actionLabel: t('submission.list.completeSubmission'),
						actionArgs: {submissionId: submission.id},
					},
				},
			];
		}

		// Warning that I am assigned as author, relevant if I am NOT assigned via any editorial role
		if (
			hasCurrentUserAtLeastOneAssignedRoleInAnyStage(submission, [
				pkp.const.ROLE_ID_AUTHOR,
			]) &&
			!hasCurrentUserAtLeastOneAssignedRoleInAnyStage(submission, [
				pkp.const.ROLE_ID_MANAGER,
				pkp.const.ROLE_ID_SUB_EDITOR,
				pkp.const.ROLE_ID_ASSISTANT,
			])
		) {
			return [
				{
					component: 'DashboardCellSubmissionActivityActionAlert',
					props: {
						alert: t('dashboard.noAccessBeingAuthor'),
					},
				},
			];
		}

		// Warning that I am assigned as author, relevant if I am NOT assigned via any editorial role
		if (
			isCurrentUserAssignedAsReviewer(submission) &&
			!hasCurrentUserAtLeastOneAssignedRoleInAnyStage(submission, [
				pkp.const.ROLE_ID_MANAGER,
				pkp.const.ROLE_ID_SUB_EDITOR,
				pkp.const.ROLE_ID_ASSISTANT,
			])
		) {
			return [
				{
					component: 'DashboardCellSubmissionActivityActionAlert',
					props: {
						alert: t('dashboard.noAccessBeingReviewer'),
					},
				},
			];
		}

		if (activeStage.id === pkp.const.WORKFLOW_STAGE_ID_SUBMISSION) {
			if (!submission.editorAssigned) {
				return [
					{
						component: 'DashboardCellSubmissionActivityActionAlert',
						props: {
							actionName: ParticipantManagerActions.PARTICIPANT_ASSIGN,
							actionLabel: t('submission.list.assignEditor'),
							actionArgs: {submissionId: submission.id},
						},
					},
				];
			}
		}
		if (
			activeStage.id === pkp.const.WORKFLOW_STAGE_ID_EXTERNAL_REVIEW ||
			activeStage.id === pkp.const.WORKFLOW_STAGE_ID_INTERNAL_REVIEW
		) {
			const activeRound = getCurrentReviewRound(submission, activeStage.id);
			let activeRoundStatusId = activeRound.statusId;

			// Workaround to customise deciding editor messaging, until we have way to provide personalised on backend
			if (activeStage.isCurrentUserDecidingEditor) {
				// Avoid overloading deciding editor with details about review assignments
				// Until some/all recommendation(s) is ready
				switch (activeRoundStatusId) {
					case pkp.const.REVIEW_ROUND_STATUS_PENDING_REVIEWERS:
					case pkp.const.REVIEW_ROUND_STATUS_PENDING_REVIEWS:
					case pkp.const.REVIEW_ROUND_STATUS_REVIEWS_READY:
					case pkp.const.REVIEW_ROUND_STATUS_REVIEWS_COMPLETED:
					case pkp.const.REVIEW_ROUND_STATUS_REVIEWS_OVERDUE:
					case pkp.const.REVIEW_ROUND_STATUS_RETURNED_TO_REVIEW:
						activeRoundStatusId =
							pkp.const.REVIEW_ROUND_STATUS_PENDING_RECOMMENDATIONS;
				}
			}

			// Workaround to customise deciding editor messaging, until we have way to provide personalised on backend
			if (activeStage.currentUserCanRecommendOnly) {
				// If the recommend only editor already submmited his recommendation, its detected from the `currentUserRecommendation`

				if (activeStage.currentUserRecommendation) {
					return [
						{
							component: 'DashboardCellSubmissionActivityActionAlert',
							props: {
								alert: t(
									'editor.submission.roundStatus.recommendationMadeByYou',
								),
							},
						},
					];
				}

				// Recommendation statuses are useful for deciding editor, but not recommendOnly editor.
				if (
					[
						pkp.const.REVIEW_ROUND_STATUS_PENDING_RECOMMENDATIONS,
						pkp.const.REVIEW_ROUND_STATUS_RECOMMENDATIONS_READY,
						pkp.const.REVIEW_ROUND_STATUS_RECOMMENDATIONS_COMPLETED,
					].includes(activeRoundStatusId)
				) {
					const areAllReviewAssignmentsConfirmed = getActiveReviewAssignments(
						getReviewAssignmentsForRound(
							submission.reviewAssignments,
							activeRound.id,
						),
					).every((reviewAssignment) =>
						[
							pkp.const.REVIEW_ASSIGNMENT_STATUS_COMPLETE,
							pkp.const.REVIEW_ASSIGNMENT_STATUS_THANKED,
						].includes(reviewAssignment.statusId),
					);
					// When getting RECOMMENDATION related status, the information about review assignment related status is lost
					// Only review assignment related status, where we provide messaging is REVIEW_ROUND_STATUS_REVIEWS_COMPLETED
					// For other statuses we only show review assignment indications and therefore can fallback for example to REVIEW_ROUND_STATUS_PENDING_REVIEWS
					if (areAllReviewAssignmentsConfirmed) {
						activeRoundStatusId =
							pkp.const.REVIEW_ROUND_STATUS_REVIEWS_COMPLETED;
					} else {
						activeRoundStatusId = pkp.const.REVIEW_ROUND_STATUS_PENDING_REVIEWS;
					}
				}
			}

			if (
				activeRoundStatusId === pkp.const.REVIEW_ROUND_STATUS_PENDING_REVIEWERS
			) {
				return [
					{
						component: 'DashboardCellSubmissionActivityActionAlert',
						props: {
							actionName: ReviewerManagerActions.REVIEWER_ADD_REVIEWER,
							actionLabel: t('dashboard.assignReviewers'),
							actionArgs: {
								reviewRoundId: activeRound.id,
								submissionId: submission.id,
							},
						},
					},
				];
			} else if (
				activeRoundStatusId ===
				pkp.const.REVIEW_ROUND_STATUS_REVISIONS_REQUESTED
			) {
				return [
					{
						component: 'DashboardCellSubmissionActivityActionAlert',
						props: {
							alert: t('dashboard.revisionRequestedFromAuthor'),
						},
					},
					{
						component: 'DashboardCellSubmissionActivityReviews',
						props: {
							submissionId: submission.id,
							reviewAssignments: getCurrentReviewAssignments(
								submission,
								activeStage.id,
							),
						},
					},
				];
			} else if (
				activeRoundStatusId ===
				pkp.const.REVIEW_ROUND_STATUS_RESUBMIT_FOR_REVIEW
			) {
				return [
					{
						component: 'DashboardCellSubmissionActivityActionAlert',
						props: {
							alert: t('dashboard.revisionsRequestedFromAuthorNextRound'),
						},
					},
				];
			} else if (
				activeRoundStatusId ===
				pkp.const.REVIEW_ROUND_STATUS_REVISIONS_SUBMITTED
			) {
				return [
					{
						component: 'DashboardCellSubmissionActivityActionAlert',
						props: {
							alert: t('submission.list.revisionsSubmitted'),
						},
					},
					{
						component: 'DashboardCellSubmissionActivityReviews',
						props: {
							submissionId: submission.id,
							reviewAssignments: getCurrentReviewAssignments(
								submission,
								activeStage.id,
							),
						},
					},
				];
			} else if (
				activeRoundStatusId ===
				pkp.const.REVIEW_ROUND_STATUS_PENDING_RECOMMENDATIONS
			) {
				return [
					{
						component: 'DashboardCellSubmissionActivityActionAlert',
						props: {
							alert: t('dashboard.recommendOnly.pendingRecommendations'),
						},
					},
				];
			} else if (
				activeRoundStatusId ===
				pkp.const.REVIEW_ROUND_STATUS_RECOMMENDATIONS_READY
			) {
				return [
					{
						component: 'DashboardCellSubmissionActivityActionAlert',
						props: {
							alert: t('dashboard.recommendOnly.recommendationsReady'),
						},
					},
				];
			} else if (
				activeRoundStatusId ===
				pkp.const.REVIEW_ROUND_STATUS_RECOMMENDATIONS_COMPLETED
			) {
				return [
					{
						component: 'DashboardCellSubmissionActivityActionAlert',
						props: {
							alert: t('dashboard.recommendOnly.recommendationsCompleted'),
						},
					},
				];
			} else if (
				activeRoundStatusId ===
				pkp.const.REVIEW_ROUND_STATUS_RESUBMIT_FOR_REVIEW_SUBMITTED
			) {
				return [
					{
						component: 'DashboardCellSubmissionActivityActionAlert',
						props: {
							alert: t('submission.list.revisionsSubmitted'),
						},
					},
					{
						component: 'DashboardCellSubmissionActivityActionAlert',
						props: {
							alert: t('dashboard.newReviewRoundToBeCreated'),
						},
					},
				];
			} else if (
				activeRoundStatusId === pkp.const.REVIEW_ROUND_STATUS_DECLINED
			) {
				return [
					{
						component: 'DashboardCellSubmissionActivityActionAlert',
						props: {
							alert: t('dashboard.declinedDuringStage', {
								stageName: t('manager.publication.reviewStage'),
							}),
						},
					},
				];
			} else if (
				activeRoundStatusId === pkp.const.REVIEW_ROUND_STATUS_REVIEWS_COMPLETED
			) {
				return [
					{
						component: 'DashboardCellSubmissionActivityActionAlert',
						props: {
							alert: t('editor.submission.roundStatus.reviewsCompleted'),
						},
					},
					{
						component: 'DashboardCellSubmissionActivityReviews',
						props: {
							submissionId: submission.id,
							reviewAssignments: getCurrentReviewAssignments(
								submission,
								activeStage.id,
							),
						},
					},
				];
			} else {
				return [
					{
						component: 'DashboardCellSubmissionActivityReviews',
						props: {
							submissionId: submission.id,
							reviewAssignments: getCurrentReviewAssignments(
								submission,
								activeStage.id,
							),
						},
					},
				];
			}
		}

		return {};
	}

	function getEditorialActivityForMySubmissions(submission) {
		const activeStage = getActiveStage(submission);

		// Not checking for submission stage, as OPS does not have it
		if (submission.submissionProgress) {
			return [
				{
					component: 'DashboardCellSubmissionActivityActionAlert',
					props: {
						actionName: 'openSubmissionWizard',
						actionLabel: t('submission.list.completeSubmission'),
						actionArgs: {submissionId: submission.id},
					},
				},
			];
		}

		if (
			activeStage.id === pkp.const.WORKFLOW_STAGE_ID_EXTERNAL_REVIEW ||
			activeStage.id === pkp.const.WORKFLOW_STAGE_ID_INTERNAL_REVIEW
		) {
			const activeRound = getCurrentReviewRound(submission, activeStage.id);

			if (
				[pkp.const.REVIEW_ROUND_STATUS_REVISIONS_REQUESTED].includes(
					activeRound.statusId,
				)
			) {
				const fileStage =
					activeStage.id === pkp.const.WORKFLOW_STAGE_ID_INTERNAL_REVIEW
						? pkp.const.SUBMISSION_FILE_INTERNAL_REVIEW_REVISION
						: pkp.const.SUBMISSION_FILE_REVIEW_REVISION;
				return [
					{
						component: 'DashboardCellSubmissionActivityActionAlert',
						props: {
							alert: t('dashboard.revisionRequested'),
							actionLabel: t('dashboard.submitRevisions'),
							actionName: FileManagerActions.FILE_UPLOAD,
							actionArgs: {
								submissionId: submission.id,
								fileStage,
								reviewRoundId: activeRound.id,
								wizardTitleKey: t('editor.submissionReview.uploadFile'),
							},
						},
					},
				];
			} else {
				const reviewAssignments = getCurrentReviewAssignments(
					submission,
					activeStage.id,
				);

				return [
					{
						component: 'DashboardCellSubmissionActivityReviewsUpdate',
						props: {
							reviewAssignments,
						},
					},
					{
						component: 'DashboardCellSubmissionActivityReviewsOpen',
						props: {
							reviewAssignments,
						},
					},
				];
			}
		}

		return {};
	}

	function getEditorialActivityForMyReviewAssignments(reviewAssignment) {
		// When declined always show the same status regardless of the stage
		if (
			reviewAssignment.status === pkp.const.REVIEW_ASSIGNMENT_STATUS_DECLINED
		) {
			// indeed when declined, the dateConfirmed gets set regardless if its accepted or declined
			const date = reviewAssignment.dateConfirmed;

			return [
				{
					component: 'DashboardCellReviewAssignmentActivityAlert',
					props: {
						alert: t('dashboard.reviewAssignment.declined', {
							date: formatShortDate(date),
						}),
					},
				},
			];
		}
		// if the submission moved to editorial / production stage
		if (
			[
				pkp.const.WORKFLOW_STAGE_ID_EDITING,
				pkp.const.WORKFLOW_STAGE_ID_PRODUCTION,
			].includes(reviewAssignment.submissionStageId)
		) {
			// It the review assignment is incomplete
			if (
				!CompletedReviewAssignmentStatuses.includes(reviewAssignment.status)
			) {
				return [
					{
						component: 'DashboardCellReviewAssignmentActivityAlert',
						props: {
							alert: t(`submissions.incomplete`),
						},
					},
				];
			}
		}

		if (
			[
				pkp.const.REVIEW_ASSIGNMENT_STATUS_AWAITING_RESPONSE,
				pkp.const.REVIEW_ASSIGNMENT_STATUS_REQUEST_RESEND,
			].includes(reviewAssignment.status)
		) {
			const date = reviewAssignment.dateResponseDue;
			return [
				{
					component: 'DashboardCellReviewAssignmentActivityAlert',
					props: {
						alert: t('dashboard.reviewAssignment.acceptOrDeclineRequestDate', {
							date: formatShortDate(date),
						}),
					},
				},
			];
		}
		if (
			reviewAssignment.status ===
			pkp.const.REVIEW_ASSIGNMENT_STATUS_RESPONSE_OVERDUE
		) {
			return [
				{
					component: 'DashboardCellReviewAssignmentActivityAlert',
					props: {
						alert: t(
							'dashboard.reviewAssignment.deadlineForRespondingAcceptOrDecline',
						),
					},
				},
			];
		}
		if (
			reviewAssignment.status === pkp.const.REVIEW_ASSIGNMENT_STATUS_ACCEPTED
		) {
			const date = reviewAssignment.dateDue;

			return [
				{
					component: 'DashboardCellReviewAssignmentActivityAlert',
					props: {
						alert: t('dashboard.reviewAssignment.completeReviewByDate', {
							date,
						}),
					},
				},
			];
		}
		if (
			reviewAssignment.status ===
			pkp.const.REVIEW_ASSIGNMENT_STATUS_REVIEW_OVERDUE
		) {
			return [
				{
					component: 'DashboardCellReviewAssignmentActivityAlert',
					props: {
						alert: t(
							'dashboard.reviewAssignment.deadlineForCompletingReviewHasPassed',
						),
					},
				},
			];
		}
		if (CompletedReviewAssignmentStatuses.includes(reviewAssignment.status)) {
			const date = reviewAssignment.dateCompleted;

			return [
				{
					component: 'DashboardCellReviewAssignmentActivityAlert',
					props: {
						alert: t('dashboard.reviewAssignment.reviewSubmitted', {
							date: formatShortDate(date),
						}),
					},
				},
			];
		}
		if (
			// Cancelled review assignments should be filtered out, this should not appear, just for documentation
			reviewAssignment.status === pkp.const.REVIEW_ASSIGNMENT_STATUS_CANCELLED
		) {
			return [
				{
					component: 'DashboardCellReviewAssignmentActivityAlert',
					props: {
						alert: `-`,
					},
				},
			];
		}

		return [];
	}

	return {
		getEditorialActivityForEditorialDashboard,
		getEditorialActivityForMySubmissions,
		getEditorialActivityForMyReviewAssignments,
	};
}
