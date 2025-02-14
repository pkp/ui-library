import {useLegacyGridUrl} from '@/composables/useLegacyGridUrl';
import {useUrl} from '@/composables/useUrl';
import {useModal} from '@/composables/useModal';
import {useLocalize} from '@/composables/useLocalize';
import {useSubmission} from '@/composables/useSubmission';
import {useFetch, getCSRFToken} from '@/composables/useFetch';
import WorkflowLogResponseModal from '@/managers/ReviewerManager/modals/WorkflowLogResponseModal.vue';
import {useApiUrl} from '@/composables/useApiUrl';

export const Actions = {
	REVIEWER_ADD_REVIEWER: 'reviewerAddReviewer',
	REVIEWER_READ_REVIEW: 'reviewerReadReview',
	REVIEWER_READ_REVIEW_BY_AUTHOR: 'reviewerReadReviewByAuthor',
	REVIEWER_REVIEW_DETAILS: 'reviewerReviewDetails',
	REVIEWER_EMAIL_REVIEWER: 'reviewerEmailReviewer',
	REVIEWER_RESEND_REQUEST: 'reviewerResendRequest',
	REVIEWER_EDIT_REVIEW: 'reviewerEditReview',
	REVIEWER_CANCEL_REVIEWER: 'reviewerCancelReviewer',
	REVIEWER_UNASSIGN_REVIEWER: 'reviewerUnassignReviewer',
	REVIEWER_REINSTATE_REVIEWER: 'reviewerReinstateReviewer',
	REVIEWER_REVIEW_HISTORY: 'reviewerReviewHistory',
	REVIEWER_LOGIN_AS: 'reviewerLoginAs',
	REVIEWER_EDITORIAL_NOTES: 'reviewerEditorialNotes',
	REVIEWER_THANK_REVIEWER: 'reviewerThankReviewer',
	REVIEWER_REVERT_CONSIDER: 'reviewerRevertConsider',
	REVIEWER_SEND_REMINDER: 'reviewerSendReminder',
	REVIEWER_LOG_RESPONSE: 'reviewerLogResponse',
	REVIEWER_SEND_TO_ORCID: 'reviewerSendToOrcid',
};

export function useReviewerManagerActions() {
	const {t, localizeSubmission} = useLocalize();

	function getTopActions({redactedForAuthors}) {
		const actions = [];
		if (redactedForAuthors) {
			return [];
		}
		actions.push({
			label: t('editor.submission.addReviewer'),
			name: Actions.REVIEWER_ADD_REVIEWER,
		});

		return actions;
	}

	function getItemPrimaryActions({reviewAssignment, redactedForAuthors}) {
		const reviewAssignmentStatusId = reviewAssignment.statusId;
		const actions = [];

		if (redactedForAuthors) {
			if (
				[
					pkp.const.REVIEW_ASSIGNMENT_STATUS_COMPLETE,
					pkp.const.REVIEW_ASSIGNMENT_STATUS_THANKED,
					pkp.const.REVIEW_ASSIGNMENT_STATUS_RECEIVED,
					pkp.const.REVIEW_ASSIGNMENT_STATUS_VIEWED,
				].includes(reviewAssignmentStatusId)
			) {
				return [
					{
						label: t('editor.review.readReview'),
						name: Actions.REVIEWER_READ_REVIEW_BY_AUTHOR,
					},
				];
			}
			return [];
		}
		if (
			[
				pkp.const.REVIEW_ASSIGNMENT_STATUS_RESPONSE_OVERDUE,
				pkp.const.REVIEW_ASSIGNMENT_STATUS_REVIEW_OVERDUE,
			].includes(reviewAssignmentStatusId)
		) {
			actions.push({
				label: t('editor.review.sendReminder'),
				name: Actions.REVIEWER_SEND_REMINDER,
			});
		} else if (
			reviewAssignmentStatusId === pkp.const.REVIEW_ASSIGNMENT_STATUS_COMPLETE
		) {
			actions.push({
				label: t('editor.review.thankReviewer'),
				name: Actions.REVIEWER_THANK_REVIEWER,
			});
			actions.push({
				label: t('editor.review.revertDecision'),
				name: Actions.REVIEWER_REVERT_CONSIDER,
			});
		} else if (
			reviewAssignmentStatusId === pkp.const.REVIEW_ASSIGNMENT_STATUS_THANKED
		) {
			actions.push({
				label: t('editor.review.revertDecision'),
				name: Actions.REVIEWER_REVERT_CONSIDER,
			});
		} else if (
			[
				pkp.const.REVIEW_ASSIGNMENT_STATUS_RECEIVED,
				pkp.const.REVIEW_ASSIGNMENT_STATUS_VIEWED,
			].includes(reviewAssignmentStatusId)
		) {
			actions.push({
				label: t('editor.review.readReview'),
				name: Actions.REVIEWER_READ_REVIEW,
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
				name: Actions.REVIEWER_REVIEW_DETAILS,
				icon: 'View',
			});
		}

		// Email Reviewer
		actions.push({
			label: t('editor.review.emailReviewer'),
			name: Actions.REVIEWER_EMAIL_REVIEWER,
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
					name: Actions.REVIEWER_RESEND_REQUEST,
				});
			}

			// Edit
			if (
				reviewAssignmentStatusId !==
				pkp.const.REVIEW_ASSIGNMENT_STATUS_CANCELLED
			) {
				actions.push({
					label: t('common.edit'),
					name: Actions.REVIEWER_EDIT_REVIEW,
					icon: 'Edit',
				});

				actions.push({
					label: reviewAssignment.dateConfirmed
						? t('editor.review.cancelReviewer')
						: t('editor.review.unassignReviewer'),
					name: reviewAssignment.dateConfirmed
						? Actions.REVIEWER_CANCEL_REVIEWER
						: Actions.REVIEWER_UNASSIGN_REVIEWER,
					icon: 'Cancel',
					isWarnable: true,
				});
			} else {
				actions.push({
					label: t('editor.review.reinstateReviewer'),
					name: Actions.REVIEWER_REINSTATE_REVIEWER,
				});
			}
		}

		// History
		actions.push({
			label: t('submission.history'),
			name: Actions.REVIEWER_REVIEW_HISTORY,
			icon: 'History',
		});

		// Login as TODO condition
		actions.push({
			label: t('grid.action.logInAs'),
			name: Actions.REVIEWER_LOGIN_AS,
			icon: 'LoginAs',
		});

		// Gossip TODO condition
		actions.push({
			label: t('user.gossip'),
			name: Actions.REVIEWER_EDITORIAL_NOTES,
			icon: 'DefaultDocument',
		});

		if (!reviewAssignment.dateConfirmed) {
			actions.push({
				label: t('editor.review.logResponse'),
				name: Actions.REVIEWER_LOG_RESPONSE,
				icon: 'ReviewAssignments',
			});
		}

		// ORCID reviewer deposit
		if (
			reviewAssignment.reviewerHasOrcid &&
			pkp.const.REVIEW_ASSIGNMENT_STATUS_COMPLETE
		) {
			actions.push({
				label: t('dashboard.reviewAssignment.action.sendReviewToOrcid'),
				name: Actions.REVIEWER_SEND_TO_ORCID,
				icon: 'Orcid',
			});
		}

		return actions;
	}

	function reviewerAddReviewer({submission, reviewRoundId}, finishedCallback) {
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
	}

	function reviewerReadReviewByAuthor(
		{submission, reviewAssignment, submissionStageId},
		finishedCallback,
	) {
		const {openLegacyModal} = useLegacyGridUrl({
			component: 'grid.users.reviewer.AuthorReviewerGridHandler',
			op: 'readReview',
			params: {
				submissionId: submission.id,
				reviewAssignmentId: reviewAssignment.id,
				stageId: submissionStageId,
			},
		});

		const {getCurrentPublication} = useSubmission();
		const currentPublication = getCurrentPublication(submission);

		openLegacyModal(
			{
				title: `${t('semicolon', {label: t('submission.review')})} ${localizeSubmission(currentPublication.fullTitle, currentPublication.locale)}`,
			},
			finishedCallback,
		);
	}

	function reviewerReadReview(
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

		openLegacyModal(
			{
				title: `${t('semicolon', {label: t('submission.review')})} ${localizeSubmission(currentPublication.fullTitle, currentPublication.locale)}`,
			},
			finishedCallback,
		);
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

		openLegacyModal(
			{
				title: `${t('semicolon', {label: t('editor.review.reviewDetails')})} ${localizeSubmission(currentPublication.fullTitle, currentPublication.locale)}`,
			},
			finishedCallback,
		);
	}

	function reviewerEmailReviewer(
		{submission, reviewAssignment, submissionStageId},
		finishedCallback,
	) {
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
	}

	function reviewerResendRequest(
		{submission, reviewAssignment, submissionStageId},
		finishedCallback,
	) {
		const {openLegacyModal} = useLegacyGridUrl({
			component: 'grid.users.reviewer.ReviewerGridHandler',
			op: 'resendRequestReviewer',
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
	}

	function reviewerEditReview(
		{submission, reviewAssignment, submissionStageId},
		finishedCallback,
	) {
		// http://localhost:8000/index.php/publicknowledge/$$$call$$$/grid/users/reviewer/reviewer-grid/edit-review?submissionId=7&reviewAssignmentId=12&stageId=3

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
	}

	function reviewerUnassignReviewer(
		{submission, reviewAssignment, submissionStageId},
		finishedCallback,
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
				title: t('editor.review.unassignReviewer'),
			},
			finishedCallback,
		);
	}

	function reviewerReinstateReviewer(
		{submission, reviewAssignment, submissionStageId},
		finishedCallback,
	) {
		const {openLegacyModal} = useLegacyGridUrl({
			component: 'grid.users.reviewer.ReviewerGridHandler',
			op: 'reinstateReviewer',
			params: {
				submissionId: submission.id,
				reviewAssignmentId: reviewAssignment.id,
				stageId: submissionStageId,
			},
		});
		openLegacyModal(
			{
				title: t('editor.review.unassignReviewer'),
			},
			finishedCallback,
		);
	}

	function reviewerCancelReviewer(
		{submission, reviewAssignment, submissionStageId},
		finishedCallback,
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
				title: t('editor.review.cancelReviewer'),
			},
			finishedCallback,
		);
	}

	function reviewerReviewHistory(
		{submission, reviewAssignment, submissionStageId},
		finishedCallback,
	) {
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
	}

	function reviewerLoginAs({reviewAssignment}, finishedCallback) {
		const {openDialog} = useModal();

		openDialog(
			{
				actions: [
					{
						label: t('common.ok'),
						callback: (close) => {
							const {redirectToPage} = useUrl(
								`login/signInAsUser/${reviewAssignment.reviewerId}`,
							);
							redirectToPage();
						},
					},
					{
						label: t('common.cancel'),
						isWarnable: true,
						callback: (close) => {
							close();
						},
					},
				],
				title: t('grid.action.logInAs'),
				message: t('grid.user.confirmLogInAs'),
				modalStyle: 'primary',
			},
			finishedCallback,
		);
	}

	function reviewerEditorialNotes(
		{submission, reviewAssignment, submissionStageId},
		finishedCallback,
	) {
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

	function reviewerThankReviewer(
		{submission, reviewAssignment, submissionStageId},
		finishedCallback,
	) {
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
	}

	function reviewerRevertConsider(
		{submission, reviewAssignment, submissionStageId},
		finishedCallback,
	) {
		const {openDialog, openDialogNetworkError} = useModal();

		openDialog(
			{
				actions: [
					{
						label: t('common.ok'),
						isWarnable: true,
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
					{
						label: t('common.cancel'),
						callback: (close) => {
							close();
						},
					},
				],
				title: t('editor.review.unconsiderReview'),
				message: t('editor.review.unconsiderReviewText'),
				modalStyle: 'negative',
			},
			finishedCallback,
		);
	}

	function reviewerSendReminder(
		{submission, reviewAssignment, submissionStageId},
		finishedCallback,
	) {
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

	function reviewerLogResponse(
		{submission, reviewAssignment, submissionStageId, componentForms},
		finishedCallback,
	) {
		const {openSideModal} = useModal();

		let form = componentForms.logResponseForm;
		let submissionId = submission.id;

		const {getCurrentPublication} = useSubmission();
		const currentPublication = getCurrentPublication(submission);
		const title = `${localizeSubmission(currentPublication.fullTitle, currentPublication.locale)}`;

		const {apiUrl} = useApiUrl(
			`reviews/${submissionId}/${reviewAssignment.id}/confirmReview`,
		);

		form.action = apiUrl;

		openSideModal(
			WorkflowLogResponseModal,
			{
				title: title,
				submissionId: submissionId,
				logResponseForm: componentForms.logResponseForm,
			},
			{onClose: finishedCallback},
		);
	}

	function reviewerSendToOrcid({submission, reviewAssignment}) {
		const {openDialog, openDialogNetworkError} = useModal();

		let submissionId = submission.id;

		openDialog({
			actions: [
				{
					label: t('common.ok'),
					isPrimary: true,
					callback: async (close) => {
						const {apiUrl} = useApiUrl(
							`reviews/${submissionId}/${reviewAssignment.id}/sendToOrcid`,
						);

						const formData = new FormData();
						formData.append('csrfToken', getCSRFToken());

						const {fetch, isSuccess} = useFetch(apiUrl, {
							method: 'POST',
							body: formData,
						});

						await fetch();
						close();
						if (!isSuccess.value) {
							openDialogNetworkError();
						}
					},
				},
				{
					label: t('common.cancel'),
					callback: (close) => close(),
				},
			],
			title: t('dashboard.reviewAssignment.action.sendReviewToOrcid'),
			message: t('dashboard.reviewAssignment.action.sendReviewToOrcid.confirm'),
		});
	}

	return {
		getTopActions,
		getItemActions,
		getItemPrimaryActions,
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
	};
}
