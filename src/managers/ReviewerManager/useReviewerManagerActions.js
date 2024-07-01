import {useLegacyGridUrl} from '@/composables/useLegacyGridUrl';
import {useUrl} from '@/composables/useUrl';
import {useModal} from '@/composables/useModal';
import {useLocalize} from '@/composables/useLocalize';

function openLegacyGriAction({op, title, params}) {
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
				//finishedCallback();
			},
		},
	);
}

export function useReviewerManagerActions() {
	function getAvailableActions(reviewAssignment) {
		const actions = [];
		const reviewAssignmentStatusId = reviewAssignment.statusId;
		// Review Details
		if (
			reviewAssignmentStatusId !== pkp.const.REVIEW_ASSIGNMENT_STATUS_CANCELLED
		) {
			actions.push({
				label: 'Review Details',
				name: 'reviewDetails',
			});
		}

		// Email Reviewer
		actions.push({
			label: 'Email Reviewer',
			name: 'emailReviewer',
		});

		// add condition if current user is not assigned author
		const currentUserNotAssignedAuthor = true;

		if (currentUserNotAssignedAuthor) {
			// Resend request reviewer
			if (
				reviewAssignmentStatusId === pkp.const.REVIEW_ASSIGNMENT_STATUS_DECLINED
			) {
				actions.push({
					label: 'Resend Request',
					name: 'resendRequest',
				});
			}

			// Edit
			if (
				reviewAssignmentStatusId !==
				pkp.const.REVIEW_ASSIGNMENT_STATUS_CANCELLED
			) {
				actions.push({
					label: 'Edit',
					name: 'editReview',
				});

				actions.push({
					label: reviewAssignment.dateConfirmed
						? 'Cancel Reviewer'
						: 'Unassign Reviewer',
					name: reviewAssignment.dateConfirmed
						? 'cancelReviewer'
						: 'unassignReviewer',
				});
			} else {
				actions.push({
					label: 'Reinstate reviewer',
					name: 'reinstateReviewer',
				});
			}
		}

		// History
		actions.push({
			label: 'History',
			name: 'reviewHistory',
		});

		// Login as TODO condition
		actions.push({
			label: 'Login as',
			name: 'loginAs',
		});

		// Gossip TODO condition
		actions.push({
			label: 'Editorial Notes',
			name: 'editorialNotes',
		});

		return actions;
	}

	function handleAction(
		actionName,
		{reviewAssignment, submissionId, submissionStageId},
	) {
		const {t} = useLocalize();

		if (actionName === 'reviewDetails') {
			openLegacyGriAction({
				title: t('editor.review.reviewDetails'),
				op: 'readReview',
				params: {
					submissionId: submissionId,
					reviewAssignmentId: reviewAssignment.id,
					stageId: submissionStageId,
				},
			});
		} else if (actionName === 'emailReviewer') {
			openLegacyGriAction({
				title: t('editor.review.emailReviewer'),
				op: 'sendEmail',
				params: {
					submissionId: submissionId,
					reviewAssignmentId: reviewAssignment.id,
					stageId: submissionStageId,
				},
			});
		} else if (actionName === 'editReview') {
			openLegacyGriAction({
				title: t('editor.submissionReview.editReview'),
				op: 'editReview',
				params: {
					submissionId: submissionId,
					reviewAssignmentId: reviewAssignment.id,
					stageId: submissionStageId,
				},
			});
		} else if (
			actionName === 'unassignReviewer' ||
			actionName === 'cancelReviewer'
		) {
			openLegacyGriAction({
				title:
					actionName === 'unassignReviewer'
						? t('editor.review.unassignReviewer')
						: t('editor.review.cancelReviewer'),
				op: 'unassignReviewer',
				params: {
					submissionId: submissionId,
					reviewAssignmentId: reviewAssignment.id,
					stageId: submissionStageId,
				},
			});
		} else if (actionName === 'reviewHistory') {
			openLegacyGriAction({
				title: t('submission.history'),
				op: 'reviewHistory',
				params: {
					submissionId: submissionId,
					reviewAssignmentId: reviewAssignment.id,
					stageId: submissionStageId,
				},
			});
		} else if (actionName === 'loginAs') {
			const {openDialog} = useModal();

			openDialog({
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
				title: 'Login as (t)',
				message:
					'Log in as this user? All actions you perform will be attributed to this user. (t)',
			});
		} else if (actionName === 'editorialNotes') {
			openLegacyGriAction({
				title: t('user.gossip'),
				op: 'gossip',
				params: {
					submissionId: submissionId,
					reviewAssignmentId: reviewAssignment.id,
					stageId: submissionStageId,
				},
			});
		}
	}

	return {getAvailableActions, handleAction};
}
