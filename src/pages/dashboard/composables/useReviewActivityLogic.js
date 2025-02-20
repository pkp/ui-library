import {useLocalize} from '@/composables/useLocalize';
import {useDate} from '@/composables/useDate';
import {RecommendationTranslations} from '@/composables/useSubmission';
import {Actions as ReviewerManagerActions} from '@/managers/ReviewerManager/useReviewerManagerActions';
const {tk, t} = useLocalize();

const {calculateDaysBetweenDates} = useDate();
const ReviewActivityActions = {
	RESEND_REVIEW_REQUEST: 'resendReviewRequest',
	EDIT_DUE_DATE: 'editDueDate',
	VIEW_DETAILS: 'viewDetails',
	CANCEL_REVIEWER: 'cancelReviewer',
	UNASSIGN_REVIEWER: 'unassignReviewer',
	VIEW_RECOMMENDATION: 'viewRecommendation',
	VIEW_UNREAD_RECOMMENDATION: 'viewUnreadRecommendation',
};

const ActionsMapping = {
	[ReviewActivityActions.RESEND_REVIEW_REQUEST]:
		ReviewerManagerActions.REVIEWER_RESEND_REQUEST,
	[ReviewActivityActions.EDIT_DUE_DATE]:
		ReviewerManagerActions.REVIEWER_EDIT_REVIEW,
	[ReviewActivityActions.VIEW_DETAILS]:
		ReviewerManagerActions.REVIEWER_REVIEW_DETAILS,
	[ReviewActivityActions.CANCEL_REVIEWER]:
		ReviewerManagerActions.REVIEWER_CANCEL_REVIEWER,
	[ReviewActivityActions.UNASSIGN_REVIEWER]:
		ReviewerManagerActions.REVIEWER_UNASSIGN_REVIEWER,
	[ReviewActivityActions.VIEW_RECOMMENDATION]:
		ReviewerManagerActions.REVIEWER_REVIEW_DETAILS,
	[ReviewActivityActions.VIEW_UNREAD_RECOMMENDATION]:
		ReviewerManagerActions.REVIEWER_REVIEW_DETAILS,
};

const ActionButtonTranslations = {
	[ReviewActivityActions.RESEND_REVIEW_REQUEST]: tk(
		'dashboard.reviewAssignment.action.resendReviewRequest',
	),
	[ReviewActivityActions.EDIT_DUE_DATE]: tk(
		'dashboard.reviewAssignment.action.editDueDate',
	),
	[ReviewActivityActions.VIEW_DETAILS]: tk(
		'dashboard.reviewAssignment.action.viewDetails',
	),
	[ReviewActivityActions.CANCEL_REVIEWER]: tk(
		'dashboard.reviewAssignment.action.cancelReviewer',
	),
	[ReviewActivityActions.UNASSIGN_REVIEWER]: tk(
		'dashboard.reviewAssignment.action.unassignReviewer',
	),
	[ReviewActivityActions.VIEW_RECOMMENDATION]: tk(
		'dashboard.reviewAssignment.action.viewRecommendation',
	),
	[ReviewActivityActions.VIEW_UNREAD_RECOMMENDATION]: tk(
		'dashboard.reviewAssignment.action.viewUnreadRecommendation',
	),
};

const ConfigPerStatus = {
	// request has been sent but reviewer has not responded
	[pkp.const.REVIEW_ASSIGNMENT_STATUS_AWAITING_RESPONSE]: {
		reviewActivityIndicator: {
			colorVariant: 'stage-in-review',
			displayVariant: 'progress',
		},
		badgeProps: {
			icon: 'ReviewSent',
			colorVariant: 'stage-in-review-bg',
		},
		titleKey: tk('dashboard.reviewAssignment.statusAwaitingResponse.title'),
		descriptionKey: tk(
			'dashboard.reviewAssignment.statusAwaitingResponse.description',
		),
		textAction: ReviewActivityActions.EDIT_DUE_DATE,
		primaryAction: ReviewActivityActions.VIEW_DETAILS,
		negativeAction: ReviewActivityActions.UNASSIGN_REVIEWER,
		dateToDisplay: 'dateResponseDue',
	},
	// reviewer declined review request
	[pkp.const.REVIEW_ASSIGNMENT_STATUS_DECLINED]: {
		reviewActivityIndicator: {
			colorVariant: 'negative',
			displayVariant: 'fill',
			icon: 'ReviewRequestDeclined',
		},
		badgeProps: {
			colorVariant: 'negative-bg',
			icon: 'ReviewRequestDeclined',
		},
		titleKey: tk('dashboard.reviewAssignment.statusDeclined.title'),
		descriptionKey: tk('dashboard.reviewAssignment.statusDeclined.description'),
		textAction: ReviewActivityActions.RESEND_REVIEW_REQUEST,
		primaryAction: ReviewActivityActions.VIEW_DETAILS,
		negativeAction: ReviewActivityActions.CANCEL_REVIEWER,
		dateToDisplay: 'dateConfirmed',
	},
	// review not responded within due date
	[pkp.const.REVIEW_ASSIGNMENT_STATUS_RESPONSE_OVERDUE]: {
		reviewActivityIndicator: {
			colorVariant: 'attention',
			displayVariant: 'progress',
		},
		badgeProps: {
			colorVariant: 'attention-bg',
			icon: 'Overdue',
		},
		titleKey: tk('dashboard.reviewAssignment.statusResponseOverdue.title'),
		descriptionKey: tk(
			'dashboard.reviewAssignment.statusResponseOverdue.description',
		),
		textAction: ReviewActivityActions.EDIT_DUE_DATE,
		primaryAction: ReviewActivityActions.VIEW_DETAILS,
		negativeAction: ReviewActivityActions.UNASSIGN_REVIEWER,
		dateToDisplay: 'dateResponseDue',
	},
	// reviewer has agreed to the review
	[pkp.const.REVIEW_ASSIGNMENT_STATUS_ACCEPTED]: {
		reviewActivityIndicator: {
			colorVariant: 'primary',
			displayVariant: 'progress',
		},
		badgeProps: {
			colorVariant: 'primary-bg',
			icon: 'InProgress',
		},
		titleKey: tk('dashboard.reviewAssignment.statusAccepted.title'),
		descriptionKey: tk('dashboard.reviewAssignment.statusAccepted.description'),
		textAction: ReviewActivityActions.EDIT_DUE_DATE,
		primaryAction: ReviewActivityActions.VIEW_DETAILS,
		negativeAction: ReviewActivityActions.UNASSIGN_REVIEWER,
		dateToDisplay: 'dateDue',
	},
	// review not submitted within due date
	[pkp.const.REVIEW_ASSIGNMENT_STATUS_REVIEW_OVERDUE]: {
		reviewActivityIndicator: {
			colorVariant: 'attention',
			displayVariant: 'fill',
		},
		badgeProps: {
			colorVariant: 'attention-bg',
			icon: 'Overdue',
		},
		titleKey: tk('dashboard.reviewAssignment.statusReviewOverdue.title'),
		descriptionKey: tk(
			'dashboard.reviewAssignment.statusReviewOverdue.description',
		),
		textAction: ReviewActivityActions.EDIT_DUE_DATE,
		primaryAction: ReviewActivityActions.VIEW_DETAILS,
		negativeAction: ReviewActivityActions.UNASSIGN_REVIEWER,
		dateToDisplay: 'dateDue',
	},
	// review has been submitted
	[pkp.const.REVIEW_ASSIGNMENT_STATUS_RECEIVED]: {
		reviewActivityIndicator: {
			colorVariant: 'success',
			displayVariant: 'fill',
			icon: 'Email',
		},
		badgeProps: {
			colorVariant: 'success-bg',
			icon: 'Complete',
		},
		titleKey: tk('dashboard.reviewAssignment.statusReceived.title'),
		descriptionKey: tk('dashboard.reviewAssignment.statusReceived.description'),
		textAction: null,
		primaryAction: ReviewActivityActions.VIEW_UNREAD_RECOMMENDATION,
		negativeAction: null,
		dateToDisplay: 'dateCompleted',
	},
	// review has been viewed by editor
	[pkp.const.REVIEW_ASSIGNMENT_STATUS_VIEWED]: {
		reviewActivityIndicator: {
			colorVariant: 'success',
			displayVariant: 'fill',
			icon: 'EmailOpened',
		},
		badgeProps: {
			colorVariant: 'success-bg',
			icon: 'Complete',
		},
		titleKey: tk('dashboard.reviewAssignment.statusReceived.title'),
		descriptionKey: tk('dashboard.reviewAssignment.statusReceived.description'),
		textAction: null,
		primaryAction: ReviewActivityActions.VIEW_RECOMMENDATION,
		negativeAction: null,
		dateToDisplay: 'dateCompleted',
	},

	// review has been confirmed by an editor
	[pkp.const.REVIEW_ASSIGNMENT_STATUS_COMPLETE]: {
		reviewActivityIndicator: {
			colorVariant: 'success',
			displayVariant: 'fill',
			icon: 'Complete',
		},
		badgeProps: {
			colorVariant: 'success-bg',
			icon: 'Complete',
		},
		titleKey: tk('dashboard.reviewAssignment.statusComplete.title'),
		// same as for STATUS_RECEIVED
		descriptionKey: tk('dashboard.reviewAssignment.statusComplete.description'),
		textAction: null,
		primaryAction: ReviewActivityActions.VIEW_RECOMMENDATION,
		negativeAction: null,
		// TODO: THIS IS INCORRECT this is when the review was completed!!
		// https://github.com/pkp/pkp-lib/issues/10359
		dateToDisplay: 'dateCompleted',
	},
	// reviewer has been thanked
	// indicated currently exactly same as status complete
	[pkp.const.REVIEW_ASSIGNMENT_STATUS_THANKED]: {
		reviewActivityIndicator: {
			colorVariant: 'success',
			displayVariant: 'fill',
			icon: 'Complete',
		},
		badgeProps: {
			colorVariant: 'success-bg',
			icon: 'Complete',
		},
		titleKey: tk('dashboard.reviewAssignment.statusComplete.title'),
		descriptionKey: tk('dashboard.reviewAssignment.statusComplete.description'),
		textAction: null,
		primaryAction: ReviewActivityActions.VIEW_RECOMMENDATION,
		negativeAction: null,
		dateToDisplay: 'dateCompleted',
	},

	// editor cancelled review request
	[pkp.const.REVIEW_ASSIGNMENT_STATUS_CANCELLED]: {
		reviewActivityIndicator: {
			colorVariant: 'negative',
			displayVariant: 'fill',
			icon: 'Cancel',
		},
		badgeProps: {
			colorVariant: 'negative-bg',
			icon: 'Cancel',
		},
		titleKey: tk('dashboard.reviewAssignment.statusCancelled.title'),
		descriptionKey: tk(
			'dashboard.reviewAssignment.statusCancelled.description',
		),
		textAction: ReviewActivityActions.RESEND_REVIEW_REQUEST,
		primaryAction: ReviewActivityActions.VIEW_DETAILS,
		negativeAction: null,
		dateToDisplay: 'dateCancelled',
	},
	// request has been sent but reviewer has not responded
	[pkp.const.REVIEW_ASSIGNMENT_STATUS_REQUEST_RESEND]: {
		reviewActivityIndicator: {
			colorVariant: 'stage-in-review',
			displayVariant: 'progress',
		},
		badgeProps: {
			colorVariant: 'stage-in-review-bg',
			icon: 'ReviewSent',
		},
		titleKey: tk('dashboard.reviewAssignment.statusRequestResend.title'),
		descriptionKey: tk(
			'dashboard.reviewAssignment.statusRequestResend.description',
		),
		textAction: ReviewActivityActions.EDIT_DUE_DATE,
		primaryAction: ReviewActivityActions.VIEW_DETAILS,
		negativeAction: ReviewActivityActions.UNASSIGN_REVIEWER,
		dateToDisplay: 'dateResponseDue',
	},
};

function getDays(config, reviewAssignment) {
	if (config.dateToDisplay) {
		return calculateDaysBetweenDates(
			new Date(),
			reviewAssignment[config.dateToDisplay],
		);
	}

	return null;
}

export function useReviewActivityLogic() {
	function getReviewActivityIndicatorProps(reviewAssignment) {
		const config = ConfigPerStatus[reviewAssignment.statusId];

		const reviewActivityConfig = config.reviewActivityIndicator;

		const displayProgress = reviewActivityConfig.displayVariant === 'progress';
		let progress = null;

		if (displayProgress) {
			const start = new Date(reviewAssignment.dateAssigned);
			const end = new Date(reviewAssignment[config.dateToDisplay]);
			const today = new Date();

			progress = 100 * (1 - (today - start) / (end - start));
		}
		// show days if icon is not defined in config
		const text = !reviewActivityConfig.icon
			? String(getDays(config, reviewAssignment))
			: null;

		return {
			...reviewActivityConfig,
			text,
			progress,
		};
	}

	function getReviewActivityIndicatorPopoverProps(reviewAssignment) {
		const config = ConfigPerStatus[reviewAssignment.statusId];

		function getDate() {
			if (config.dateToDisplay) {
				return reviewAssignment[config.dateToDisplay];
			}

			return '';
		}
		const date = getDate(config, reviewAssignment);

		function getRecommendation() {
			return RecommendationTranslations[reviewAssignment.recommendation]
				? t(RecommendationTranslations[reviewAssignment.recommendation])
				: null;
		}

		const days = getDays(config, reviewAssignment);

		function getTitle() {
			return t(config.titleKey, {
				date: date,
				days: Math.abs(days),
			});
		}

		function getDescription() {
			return t(config.descriptionKey, {
				date: date,
				days: Math.abs(days),
				recommendation: getRecommendation(),
			});
		}

		function getTextActionLabel() {
			if (!config.textAction) {
				return null;
			}
			return t(ActionButtonTranslations[config.textAction]);
		}

		function getPrimaryActionLabel() {
			if (!config.primaryAction) {
				return null;
			}
			return t(ActionButtonTranslations[config.primaryAction]);
		}

		function getNegativeActionLabel() {
			if (!config.negativeAction) {
				return null;
			}
			return t(ActionButtonTranslations[config.negativeAction]);
		}

		return {
			titleBadgeProps: config.badgeProps,
			title: getTitle(),
			description: getDescription(),
			reviewMethod: reviewAssignment.method,
			textButton: config.textAction && {
				action: ActionsMapping[config.textAction],
				label: getTextActionLabel(),
			},
			primaryButton: config.primaryAction && {
				action: ActionsMapping[config.primaryAction],
				label: getPrimaryActionLabel(),
			},
			negativeButton: config.negativeAction && {
				action: ActionsMapping[config.negativeAction],
				label: getNegativeActionLabel(),
			},
			reviewerName: reviewAssignment.reviewerFullName,
		};
	}
	return {
		getReviewActivityIndicatorProps,
		getReviewActivityIndicatorPopoverProps,
	};
}
