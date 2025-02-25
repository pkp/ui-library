import {useLocalize} from '@/composables/useLocalize';
import {useDate} from '@/composables/useDate';
import {RecommendationTranslations} from '@/composables/useSubmission';
import {Actions} from './useReviewerManagerActions';

export function useReviewerManagerConfig() {
	const {t} = useLocalize();
	const {formatShortDate} = useDate();

	function getCellStatusItems({reviewAssignment}) {
		const items = [];

		function getRecommendationString(reviewAssignment) {
			const recommendationString = reviewAssignment.recommendation
				? t(RecommendationTranslations[reviewAssignment.recommendation])
				: null;

			if (recommendationString) {
				return t('submission.recommendation', {
					recommendation: recommendationString,
				});
			}

			return null;
		}

		function getCompetingInterests(reviewAssignment) {
			if (reviewAssignment.competingInterests?.length) {
				return t('reviewer.competingInterests');
			}
		}

		switch (reviewAssignment.statusId) {
			case pkp.const.REVIEW_ASSIGNMENT_STATUS_AWAITING_RESPONSE:
				items.push({
					component: 'ReviewerManagerCellStatusInfo',
					props: {
						title: t('editor.review.requestSent'),
						message: t('editor.review.responseDue', {
							date: formatShortDate(reviewAssignment.dateResponseDue),
						}),
						competingInterests: getCompetingInterests(reviewAssignment),
					},
				});
				break;

			case pkp.const.REVIEW_ASSIGNMENT_STATUS_ACCEPTED:
				items.push({
					component: 'ReviewerManagerCellStatusInfo',
					props: {
						title: t('editor.review.requestAccepted'),
						description: t('editor.review.reviewDue', {
							date: formatShortDate(reviewAssignment.dateDue),
						}),
						competingInterests: getCompetingInterests(reviewAssignment),
					},
				});
				break;
			case pkp.const.REVIEW_ASSIGNMENT_STATUS_COMPLETE:
				items.push({
					component: 'ReviewerManagerCellStatusInfo',
					props: {
						title: t('common.complete'),
						recommendation: getRecommendationString(reviewAssignment),
						competingInterests: getCompetingInterests(reviewAssignment),
					},
				});
				break;
			case pkp.const.REVIEW_ASSIGNMENT_STATUS_REVIEW_OVERDUE:
				items.push({
					component: 'ReviewerManagerCellStatusInfo',
					props: {
						title: t('common.overdue'),
						isNegative: true,
						description: t('editor.review.reviewDue', {
							date: formatShortDate(reviewAssignment.dateDue),
						}),
						competingInterests: getCompetingInterests(reviewAssignment),
					},
				});
				break;

			case pkp.const.REVIEW_ASSIGNMENT_STATUS_RESPONSE_OVERDUE:
				items.push({
					component: 'ReviewerManagerCellStatusInfo',
					props: {
						title: t('common.overdue'),
						isNegative: true,
						description: t('editor.review.responseDue', {
							date: formatShortDate(reviewAssignment.dateResponseDue),
						}),
						competingInterests: getCompetingInterests(reviewAssignment),
					},
				});
				break;

			case pkp.const.REVIEW_ASSIGNMENT_STATUS_DECLINED:
				items.push({
					component: 'ReviewerManagerCellStatusInfo',
					props: {
						title: t('editor.review.requestDeclined'),
						tooltip: t('editor.review.requestDeclined.tooltip'),
						competingInterests: getCompetingInterests(reviewAssignment),
					},
				});
				break;

			case pkp.const.REVIEW_ASSIGNMENT_STATUS_CANCELLED:
				items.push({
					component: 'ReviewerManagerCellStatusInfo',
					props: {
						title: t('editor.review.requestCancelled'),
						tooltip: t('editor.review.requestCancelled.tooltip'),
						competingInterests: getCompetingInterests(reviewAssignment),
					},
				});
				break;

			case pkp.const.REVIEW_ASSIGNMENT_STATUS_RECEIVED:
				items.push({
					component: 'ReviewerManagerCellStatusInfo',
					props: {
						title: t('editor.review.reviewSubmitted'),
						recommendation: getRecommendationString(reviewAssignment),
						competingInterests: getCompetingInterests(reviewAssignment),
					},
				});
				break;

			case pkp.const.REVIEW_ASSIGNMENT_STATUS_THANKED:
				items.push({
					component: 'ReviewerManagerCellStatusInfo',
					props: {
						title: t('editor.review.reviewerThanked'),
						recommendation: getRecommendationString(reviewAssignment),
						competingInterests: getCompetingInterests(reviewAssignment),
					},
				});
				break;

			case pkp.const.REVIEW_ASSIGNMENT_STATUS_REQUEST_RESEND:
				items.push({
					component: 'ReviewerManagerCellStatusInfo',
					props: {
						title: t('editor.review.ReviewerResendRequest'),
						description: t('editor.review.responseDue', {
							date: formatShortDate(reviewAssignment.dateDue),
						}),
						competingInterests: getCompetingInterests(reviewAssignment),
					},
				});
				break;
			case pkp.const.REVIEW_ASSIGNMENT_STATUS_VIEWED:
				items.push({
					component: 'ReviewerManagerCellStatusInfo',
					props: {
						title: t('editor.review.reviewViewed'),
						recommendation: getRecommendationString(reviewAssignment),
						competingInterests: getCompetingInterests(reviewAssignment),
					},
				});
				break;

			default:
		}

		return items;
	}

	function getColumns({submission, redactedForAuthors}) {
		const columns = [];

		const props = {submission, redactedForAuthors};

		columns.push({
			header: t('user.role.reviewer'),
			component: 'ReviewerManagerCellReviewer',
			props,
		});

		if (!redactedForAuthors) {
			columns.push({
				header: t('reviewerManager.reviewerStatus'),
				component: 'ReviewerManagerCellStatus',
				props,
			});
		}

		columns.push({
			header: t('common.type'),
			component: 'ReviewerManagerCellReviewType',
			props,
		});

		columns.push({
			header: t('grid.columns.actions'),
			component: 'ReviewerManagerCellPrimaryActions',
			props,
		});

		if (!redactedForAuthors) {
			columns.push({
				header: t('common.moreActions'),
				headerSrOnly: true,
				component: 'ReviewerManagerCellActions',
				props,
			});
		}

		return columns;
	}

	function getTopItems({redactedForAuthors}) {
		const items = [];
		if (redactedForAuthors) {
			return [];
		}
		items.push({
			component: 'ReviewerManagerActionButton',
			props: {
				label: t('editor.submission.addReviewer'),
				action: Actions.REVIEWER_ADD_REVIEWER,
			},
		});

		return items;
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

		if (reviewAssignment.canLoginAs) {
			actions.push({
				label: t('grid.action.logInAs'),
				name: Actions.REVIEWER_LOGIN_AS,
				icon: 'LoginAs',
			});
		}
		if (reviewAssignment.canGossip) {
			actions.push({
				label: t('user.gossip'),
				name: Actions.REVIEWER_EDITORIAL_NOTES,
				icon: 'DefaultDocument',
			});
		}

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

	return {
		getTopItems,
		getItemActions,
		getItemPrimaryActions,
		getCellStatusItems,
		getColumns,
	};
}
