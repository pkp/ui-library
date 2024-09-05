import {useLegacyGridUrl} from '@/composables/useLegacyGridUrl';
import {useUrl} from '@/composables/useUrl';
import {useModal} from '@/composables/useModal';
import {useLocalize} from '@/composables/useLocalize';

export const Actions = {
	ADD_REVIEWER: 'addReviewer',
	REVIEW_DETAILS: 'reviewDetails',
	EMAIL_REVIEWER: 'emailReviewer',
	RESEND_REQUEST: 'resendRequest',
	EDIT_REVIEW: 'editReview',
	CANCEL_REVIEWER: 'cancelReviewer',
	UNASSIGN_REVIEWER: 'unassignReviewer',
	REINSTATE_REVIEWER: 'reinstateReviewer',
	REVIEW_HISTORY: 'reviewHistory',
	LOGIN_AS: 'loginAs',
	EDITORIAL_NOTES: 'editorialNotes',
};

function openLegacyGriAction({op, title, params}, finishedCallback) {
	const {url} = useLegacyGridUrl({
		component: 'grid.users.reviewer.ReviewerGridHandler',
		op,
		params,
	});
	const {openSideModal} = useModal();

	openSideModal(
		'LegacyAjax',
		{
			legacyOptions: {
				title,
				url,
			},
		},
		{
			onClose: async () => {
				finishedCallback();
			},
		},
	);
}

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
			openLegacyGriAction(
				{
					op: 'showReviewerForm',
					component: 'grid.users.reviewer.ReviewerGridHandler',
					params: {
						selectionType: pkp.const.REVIEWER_SELECT_ADVANCED_SEARCH,
						submissionId: submission.id,
						stageId: submission.stageId,
						reviewRoundId,
					},
				},
				finishedCallback,
			);
		} else if (actionName === Actions.REVIEW_DETAILS) {
			openLegacyGriAction(
				{
					title: t('editor.review.reviewDetails'),
					op: 'readReview',
					params: {
						submissionId: submission.id,
						reviewAssignmentId: reviewAssignment.id,
						stageId: submissionStageId,
					},
				},
				finishedCallback,
			);
		} else if (actionName === Actions.EMAIL_REVIEWER) {
			openLegacyGriAction(
				{
					title: t('editor.review.emailReviewer'),
					op: 'sendEmail',
					params: {
						submissionId: submission.id,
						reviewAssignmentId: reviewAssignment.id,
						stageId: submissionStageId,
					},
				},
				finishedCallback,
			);
		} else if (actionName === Actions.EDIT_REVIEW) {
			openLegacyGriAction(
				{
					title: t('editor.submissionReview.editReview'),
					op: 'editReview',
					params: {
						submissionId: submission.id,
						reviewAssignmentId: reviewAssignment.id,
						stageId: submissionStageId,
					},
				},
				finishedCallback,
			);
		} else if (
			actionName === Actions.UNASSIGN_REVIEWER ||
			actionName === Actions.CANCEL_REVIEWER
		) {
			openLegacyGriAction(
				{
					title:
						actionName === Actions.UNASSIGN_REVIEWER
							? t('editor.review.unassignReviewer')
							: t('editor.review.cancelReviewer'),
					op: 'unassignReviewer',
					params: {
						submissionId: submission.id,
						reviewAssignmentId: reviewAssignment.id,
						stageId: submissionStageId,
					},
				},
				finishedCallback,
			);
		} else if (actionName === Actions.REVIEW_HISTORY) {
			openLegacyGriAction(
				{
					title: t('submission.history'),
					op: 'reviewHistory',
					params: {
						submissionId: submission.id,
						reviewAssignmentId: reviewAssignment.id,
						stageId: submissionStageId,
					},
				},
				finishedCallback,
			);
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
			openLegacyGriAction(
				{
					title: t('user.gossip'),
					op: 'gossip',
					params: {
						submissionId: submission.id,
						reviewAssignmentId: reviewAssignment.id,
						stageId: submissionStageId,
					},
				},
				finishedCallback,
			);
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
