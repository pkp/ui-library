import {useLegacyGridUrl} from '@/composables/useLegacyGridUrl';
import {useUrl} from '@/composables/useUrl';
import {useModal} from '@/composables/useModal';
import {useLocalize} from '@/composables/useLocalize';
import {useSubmission} from '@/composables/useSubmission';
import {useFetch, getCSRFToken} from '@/composables/useFetch';

export const Actions = {
	ADD_REVIEWER: 'ADD_REVIEWER',
	READ_REVIEW: 'READ_REVIEW',
	REVIEW_DETAILS: 'reviewerReviewDetails',
	EMAIL_REVIEWER: 'EMAIL_REVIEWER',
	RESEND_REQUEST: 'RESEND_REQUEST',
	EDIT_REVIEW: 'EDIT_REVIEW',
	CANCEL_REVIEWER: 'CANCEL_REVIEWER',
	UNASSIGN_REVIEWER: 'UNASSIGN_REVIEWER',
	REINSTATE_REVIEWER: 'REINSTATE_REVIEWER',
	REVIEW_HISTORY: 'REVIEW_HISTORY',
	LOGIN_AS: 'LOGIN_AS',
	EDITORIAL_NOTES: 'EDITORIAL_NOTES',
	THANK_REVIEWER: 'THANK_REVIEWER',
	REVERT_CONSIDER: 'REVERT_CONSIDER',
	SEND_REMINDER: 'SEND_REMINDER',
};

export function useReviewerManagerActions() {
	const {t, localizeSubmission} = useLocalize();

	function getTopActions() {
		const actions = [];

		actions.push({
			label: t('editor.submission.addReviewer'),
			name: Actions.ADD_REVIEWER,
		});

		return actions;
	}

	function getItemPrimaryActions({reviewAssignment}) {
		const reviewAssignmentStatusId = reviewAssignment.statusId;
		const actions = [];
		if (
			[
				pkp.const.REVIEW_ASSIGNMENT_STATUS_RESPONSE_OVERDUE,
				pkp.const.REVIEW_ASSIGNMENT_STATUS_REVIEW_OVERDUE,
			].includes(reviewAssignmentStatusId)
		) {
			actions.push({
				label: t('editor.review.sendReminder'),
				name: Actions.SEND_REMINDER,
			});
		} else if (
			reviewAssignmentStatusId === pkp.const.REVIEW_ASSIGNMENT_STATUS_COMPLETE
		) {
			actions.push({
				label: t('editor.review.thankReviewer'),
				name: Actions.THANK_REVIEWER,
			});
			actions.push({
				label: t('editor.review.revertDecision'),
				name: Actions.REVERT_CONSIDER,
			});
		} else if (
			reviewAssignmentStatusId === pkp.const.REVIEW_ASSIGNMENT_STATUS_THANKED
		) {
			actions.push({
				label: t('editor.review.revertDecision'),
				name: Actions.REVERT_CONSIDER,
			});
		} else if (
			reviewAssignmentStatusId === pkp.const.REVIEW_ASSIGNMENT_STATUS_RECEIVED
		) {
			actions.push({
				label: t('editor.review.readReview'),
				name: Actions.READ_REVIEW,
			});
		}

		return actions;
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

	function reviewerReviewDetails(
		{submission, reviewAssignment, submissionStageId},
		finishedCallback,
	) {
		const {openLegacyModal} = useLegacyGridUrl({
			component: 'grid.users.reviewer.ReviewerGridHandler',
			op: 'readReview',
			params: {
				submissionId: submission.id,
				reviewAssignmentId: reviewAssignment.id,
				stageId: submissionStageId,
			},
		});

		const {getCurrentPublication} = useSubmission();
		const currentPublication = getCurrentPublication(submission);

		const firstPartTitle = t('editor.review.reviewDetails');

		openLegacyModal(
			{
				title: `${t('semicolon', {label: firstPartTitle})} ${localizeSubmission(currentPublication.fullTitle, currentPublication.locale)}`,
			},
			finishedCallback,
		);
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

			openLegacyModal(
				{title: t('editor.submission.addReviewer')},
				finishedCallback,
			);
		} else if (
			[Actions.REVIEW_DETAILS, Actions.READ_REVIEW].includes(actionName)
		) {
			const {openLegacyModal} = useLegacyGridUrl({
				component: 'grid.users.reviewer.ReviewerGridHandler',
				op: 'readReview',
				params: {
					submissionId: submission.id,
					reviewAssignmentId: reviewAssignment.id,
					stageId: submissionStageId,
				},
			});

			const {getCurrentPublication} = useSubmission();
			const currentPublication = getCurrentPublication(submission);

			const firstPartTitle =
				actionName === Actions.REVIEW_DETAILS
					? t('editor.review.reviewDetails')
					: t('submission.review');

			openLegacyModal(
				{
					title: `${t('semicolon', {label: firstPartTitle})} ${localizeSubmission(currentPublication.fullTitle, currentPublication.locale)}`,
				},
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
		} else if (actionName === Actions.THANK_REVIEWER) {
			const {openLegacyModal} = useLegacyGridUrl({
				component: 'grid.users.reviewer.ReviewerGridHandler',
				op: 'editThankReviewer',
				params: {
					submissionId: submission.id,
					reviewAssignmentId: reviewAssignment.id,
					stageId: submissionStageId,
				},
			});

			openLegacyModal(
				{title: t('editor.review.thankReviewer')},
				finishedCallback,
			);
		} else if (actionName === Actions.REVERT_CONSIDER) {
			const {openDialog, openDialogNetworkError} = useModal();

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
							callback: async (close) => {
								// http://localhost:7002/index.php/publicknowledge/$$$call$$$/grid/users/reviewer/reviewer-grid/unconsider-review?submissionId=12&reviewAssignmentId=17&stageId=3

								const {url} = useLegacyGridUrl({
									component: 'grid.users.reviewer.ReviewerGridHandler',
									op: 'unconsiderReview',
									params: {
										submissionId: submission.id,
										reviewAssignmentId: reviewAssignment.id,
										stageId: submissionStageId,
									},
								});
								const formData = new FormData();
								formData.append('csrfToken', getCSRFToken());

								const {fetch, data} = useFetch(url, {
									method: 'POST',
									body: formData,
								});
								await fetch();
								close();
								finishedCallback();

								if (data.value.status !== true) {
									openDialogNetworkError();
								}
							},
						},
					],
					title: t('editor.review.unconsiderReview'),
					message: t('editor.review.unconsiderReviewText'),
				},
				finishedCallback,
			);
		} else if (actionName === Actions.SEND_REMINDER) {
			const {openLegacyModal} = useLegacyGridUrl({
				component: 'grid.users.reviewer.ReviewerGridHandler',
				op: 'editReminder',
				params: {
					submissionId: submission.id,
					reviewAssignmentId: reviewAssignment.id,
					stageId: submissionStageId,
				},
			});

			openLegacyModal({title: t('editor.review.reminder')}, finishedCallback);
		}
	}

	return {
		getTopActions,
		handleAction,
		getItemActions,
		getItemPrimaryActions,
		reviewerReviewDetails,
	};
}
