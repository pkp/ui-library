import {useLegacyGridUrl} from '@/composables/useLegacyGridUrl';
import {useUrl} from '@/composables/useUrl';
import {useModal} from '@/composables/useModal';
import {useLocalize} from '@/composables/useLocalize';

export const Actions = {
	ADD_REVIEWER: 'ADD_REVIEWER',
	REVIEW_DETAILS: 'REVIEW_DETAILS',
	EMAIL_REVIEWER: 'EMAIL_REVIEWER',
	RESEND_REQUEST: 'RESEND_REQUEST',
	EDIT_REVIEW: 'EDIT_REVIEW',
	CANCEL_REVIEWER: 'CANCEL_REVIEWER',
	UNASSIGN_REVIEWER: 'UNASSIGN_REVIEWER',
	REINSTATE_REVIEWER: 'REINSTATE_REVIEWER',
	REVIEW_HISTORY: 'REVIEW_HISTORY',
	LOGIN_AS: 'LOGIN_AS',
	EDITORIAL_NOTES: 'EDITORIAL_NOTES',
};

export function useReviewerManagerActions() {
	const {t} = useLocalize();

	function getTopActions() {
		const actions = [];

		actions.push({
			label: t('editor.submission.addReviewer'),
			name: Actions.ADD_REVIEWER,
		});

		return actions;
	}

	function handleAction(
		actionName,
		{submission, reviewRoundId, submissionStageId, reviewAssignment},
		finishedCallback,
	) {
		console.log(
			'handleAction manager:',
			actionName,
			submission,
			reviewRoundId,
			submissionStageId,
			reviewAssignment,
		);
		if (actionName === Actions.ADD_REVIEWER) {
			const {openLegacyModal} = useLegacyGridUrl({
				op: 'showReviewerForm',
				component: 'grid.users.reviewer.ReviewerGridHandler',
				params: {
					selectionType: pkp.const.REVIEWER_SELECT_ADVANCED_SEARCH,
					submissionId: submission.id,
					stageId: submission.stageId,
					reviewRoundId,
				},
			});

			openLegacyModal({title: 'ss'}, finishedCallback);
		} else if (actionName === Actions.REVIEW_DETAILS) {
			const {openLegacyModal} = useLegacyGridUrl({
				component: 'grid.users.reviewer.ReviewerGridHandler',
				op: 'readReview',
				params: {
					submissionId: submission.id,
					reviewAssignmentId: reviewAssignment.id,
					stageId: submissionStageId,
				},
			});

			openLegacyModal(
				{title: t('editor.review.reviewDetails')},
				finishedCallback,
			);
		} else if (actionName === Actions.EMAIL_REVIEWER) {
			const {openLegacyModal} = useLegacyGridUrl({
				component: 'grid.users.reviewer.ReviewerGridHandler',
				op: 'sendEmail',
				params: {
					submissionId: submission.id,
					reviewAssignmentId: reviewAssignment.id,
					stageId: submissionStageId,
				},
			});

			openLegacyModal(
				{title: t('editor.review.emailReviewer')},
				finishedCallback,
			);
		} else if (actionName === Actions.EDIT_REVIEW) {
			const {openLegacyModal} = useLegacyGridUrl({
				component: 'grid.users.reviewer.ReviewerGridHandler',

				op: 'editReview',

				params: {
					submissionId: submission.id,
					reviewAssignmentId: reviewAssignment.id,
					stageId: submissionStageId,
				},
			});

			openLegacyModal(
				{title: t('editor.submissionReview.editReview')},
				finishedCallback,
			);
		} else if (
			actionName === Actions.UNASSIGN_REVIEWER ||
			actionName === Actions.CANCEL_REVIEWER
		) {
			const {openLegacyModal} = useLegacyGridUrl({
				component: 'grid.users.reviewer.ReviewerGridHandler',
				op: 'unassignReviewer',
				params: {
					submissionId: submission.id,
					reviewAssignmentId: reviewAssignment.id,
					stageId: submissionStageId,
				},
			});
			openLegacyModal(
				{
					title:
						actionName === Actions.UNASSIGN_REVIEWER
							? t('editor.review.unassignReviewer')
							: t('editor.review.cancelReviewer'),
				},
				finishedCallback,
			);
		} else if (actionName === Actions.REVIEW_HISTORY) {
			const {openLegacyModal} = useLegacyGridUrl({
				component: 'grid.users.reviewer.ReviewerGridHandler',
				op: 'reviewHistory',
				params: {
					submissionId: submission.id,
					reviewAssignmentId: reviewAssignment.id,
					stageId: submissionStageId,
				},
			});

			openLegacyModal({title: t('submission.history')}, finishedCallback);
		} else if (actionName === Actions.LOGIN_AS) {
			const {openDialog} = useModal();

			openDialog(
				{
					actions: [
						{
							label: t('common.cancel'),
							isWarnable: true,
							callback: (close) => {
								close();
							},
						},
						{
							label: t('common.ok'),
							callback: (close) => {
								const {redirectToPage} = useUrl(
									`login/signInAsUser/${reviewAssignment.reviewerId}`,
								);
								redirectToPage();
							},
						},
					],
					title: t('grid.action.logInAs'),
					message: t('grid.user.confirmLogInAs'),
				},
				finishedCallback,
			);
		} else if (actionName === Actions.EDITORIAL_NOTES) {
			const {openLegacyModal} = useLegacyGridUrl({
				component: 'grid.users.reviewer.ReviewerGridHandler',
				op: 'gossip',
				params: {
					submissionId: submission.id,
					reviewAssignmentId: reviewAssignment.id,
					stageId: submissionStageId,
				},
			});

			openLegacyModal({title: t('user.gossip')}, finishedCallback);
		}
	}

	function getItemActions({reviewAssignment}) {
		const actions = [];
		const reviewAssignmentStatusId = reviewAssignment.statusId;
		// Review Details
		if (
			reviewAssignmentStatusId !== pkp.const.REVIEW_ASSIGNMENT_STATUS_CANCELLED
		) {
			actions.push({
				label: t('editor.review.reviewDetails'),
				name: Actions.REVIEW_DETAILS,
				icon: 'View',
			});
		}

		// Email Reviewer
		actions.push({
			label: t('editor.review.emailReviewer'),
			name: Actions.EMAIL_REVIEWER,
			icon: 'Email',
		});

		// add condition if current user is not assigned author
		const currentUserNotAssignedAuthor = true;

		if (currentUserNotAssignedAuthor) {
			// Resend request reviewer
			if (
				reviewAssignmentStatusId === pkp.const.REVIEW_ASSIGNMENT_STATUS_DECLINED
			) {
				actions.push({
					label: t('editor.review.resendRequestReviewer'),
					name: Actions.RESEND_REQUEST,
				});
			}

			// Edit
			if (
				reviewAssignmentStatusId !==
				pkp.const.REVIEW_ASSIGNMENT_STATUS_CANCELLED
			) {
				actions.push({
					label: t('common.edit'),
					name: Actions.EDIT_REVIEW,
					icon: 'Edit',
				});

				actions.push({
					label: reviewAssignment.dateConfirmed
						? t('editor.review.cancelReviewer')
						: t('editor.review.unassignReviewer'),
					name: reviewAssignment.dateConfirmed
						? Actions.CANCEL_REVIEWER
						: Actions.UNASSIGN_REVIEWER,
					icon: 'Cancel',
					isWarnable: true,
				});
			} else {
				actions.push({
					label: t('editor.review.reinstateReviewer'),
					name: Actions.REINSTATE_REVIEWER,
				});
			}
		}

		// History
		actions.push({
			label: t('submission.history'),
			name: Actions.REVIEW_HISTORY,
			icon: 'History',
		});

		// Login as TODO condition
		actions.push({
			label: t('grid.action.logInAs'),
			name: Actions.LOGIN_AS,
			icon: 'LoginAs',
		});

		// Gossip TODO condition
		actions.push({
			label: t('user.gossip'),
			name: Actions.EDITORIAL_NOTES,
			icon: 'DefaultDocument',
		});

		return actions;
	}

	return {getTopActions, handleAction, getItemActions};
}
