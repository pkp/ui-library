import {useLocalize} from '@/composables/useLocalize';

const {tk, t} = useLocalize();
/*
const ReviewAssignmentStatuses = [
	pkp.const.REVIEW_ASSIGNMENT_STATUS_AWAITING_RESPONSE,
	pkp.const.REVIEW_ASSIGNMENT_STATUS_DECLINED,
	pkp.const.REVIEW_ASSIGNMENT_STATUS_RESPONSE_OVERDUE,
	pkp.const.REVIEW_ASSIGNMENT_STATUS_REVIEW_OVERDUE,
	pkp.const.REVIEW_ASSIGNMENT_STATUS_ACCEPTED,
	pkp.const.REVIEW_ASSIGNMENT_STATUS_RECEIVED,

	pkp.const.REVIEW_ASSIGNMENT_STATUS_COMPLETE,
	pkp.const.REVIEW_ASSIGNMENT_STATUS_THANKED,
	pkp.const.REVIEW_ASSIGNMENT_STATUS_CANCELLED,
	pkp.const.REVIEW_ASSIGNMENT_STATUS_REQUEST_RESEND,
];

const ReviewMethods = [
	pkp.const.SUBMISSION_REVIEW_METHOD_ANONYMOUS,
	pkp.const.SUBMISSION_REVIEW_METHOD_DOUBLEANONYMOUS,
	pkp.const.SUBMISSION_REVIEW_METHOD_OPEN,
];

const Recommendations = [
	pkp.const.SUBMISSION_REVIEWER_RECOMMENDATION_ACCEPT,
	pkp.const.SUBMISSION_REVIEWER_RECOMMENDATION_PENDING_REVISIONS,
	pkp.const.SUBMISSION_REVIEWER_RECOMMENDATION_RESUBMIT_HERE,
	pkp.const.SUBMISSION_REVIEWER_RECOMMENDATION_RESUBMIT_ELSEWHERE,
	pkp.const.SUBMISSION_REVIEWER_RECOMMENDATION_DECLINE,
	pkp.const.SUBMISSION_REVIEWER_RECOMMENDATION_SEE_COMMENTS,
];
*/

const RecommendationTranslations = {
	[pkp.const.SUBMISSION_REVIEWER_RECOMMENDATION_ACCEPT]: tk(
		'reviewer.article.decision.accept',
	),
	[pkp.const.SUBMISSION_REVIEWER_RECOMMENDATION_PENDING_REVISIONS]: tk(
		'reviewer.article.decision.pendingRevisions',
	),
	[pkp.const.SUBMISSION_REVIEWER_RECOMMENDATION_RESUBMIT_HERE]: tk(
		'reviewer.article.decision.resubmitHere',
	),
	[pkp.const.SUBMISSION_REVIEWER_RECOMMENDATION_RESUBMIT_ELSEWHERE]: tk(
		'reviewer.article.decision.resubmitElsewhere',
	),
	[pkp.const.SUBMISSION_REVIEWER_RECOMMENDATION_DECLINE]: tk(
		'reviewer.article.decision.decline',
	),
	[pkp.const.SUBMISSION_REVIEWER_RECOMMENDATION_SEE_COMMENTS]: tk(
		'reviewer.article.decision.seeComments',
	),
};

const ActionButtonTranslations = {
	resendReviewRequest: tk(
		'submission.list.reviewAssignment.action.resendReviewRequest',
	),
	editDueDate: tk('submission.list.reviewAssignment.action.editDueDate'),
	viewDetails: tk('submission.list.reviewAssignment.action.viewDetails'),
	cancelReviewer: tk('submission.list.reviewAssignment.action.cancelReviewer'),
	unassignReviewer: tk(
		'submission.list.reviewAssignment.action.unassignReviewer',
	),
	viewRecommendation: tk(
		'submission.list.reviewAssignment.action.viewRecommendation',
	),
	viewUnreadRecommendation: tk(
		'submission.list.reviewAssignment.action.viewUnreadRecommendation',
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
		titleKey: tk(
			'submission.list.reviewAssignment.statusAwaitingResponse.title',
		),
		descriptionKey: tk(
			'submission.list.reviewAssignment.statusAwaitingResponse.description',
		),
		textAction: 'editDueDate',
		primaryAction: 'viewDetails',
		negativeAction: 'unassignReviewer',
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
		titleKey: tk('submission.list.reviewAssignment.statusDeclined.title'),
		descriptionKey: tk(
			'submission.list.reviewAssignment.statusDeclined.description',
		),
		textAction: 'resendReviewRequest',
		primaryAction: 'viewDetails',
		negativeAction: 'cancelReviewer',
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
		titleKey: tk(
			'submission.list.reviewAssignment.statusResponseOverdue.title',
		),
		descriptionKey: tk(
			'submission.list.reviewAssignment.statusResponseOverdue.description',
		),
		textAction: 'editDueDate',
		primaryAction: 'viewDetails',
		negativeAction: 'unassignReviewer',
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
		titleKey: tk('submission.list.reviewAssignment.statusAccepted.title'),
		descriptionKey: tk(
			'submission.list.reviewAssignment.statusAccepted.description',
		),
		textAction: 'editDueDate',
		primaryAction: 'viewDetails',
		negativeAction: 'unassignReviewer',
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
		titleKey: tk('submission.list.reviewAssignment.statusReviewOverdue.title'),
		descriptionKey: tk(
			'submission.list.reviewAssignment.statusReviewOverdue.description',
		),
		textAction: 'editDueDate',
		primaryAction: 'viewDetails',
		negativeAction: 'unassignReviewer',
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
		titleKey: tk('submission.list.reviewAssignment.statusReceived.title'),
		descriptionKey: tk(
			'submission.list.reviewAssignment.statusReceived.description',
		),
		textAction: null,
		primaryAction: 'viewUnreadRecommendation',
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
		titleKey: tk('submission.list.reviewAssignment.statusReceived.title'),
		descriptionKey: tk(
			'submission.list.reviewAssignment.statusReceived.description',
		),
		textAction: null,
		primaryAction: 'viewRecommendation',
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
		// same as for STATUS_RECEIVED
		titleKey: tk('submission.list.reviewAssignment.statusComplete.title'),
		// same as for STATUS_RECEIVED
		descriptionKey: tk(
			'submission.list.reviewAssignment.statusComplete.description',
		),
		textAction: null,
		primaryAction: 'viewRecommendation',
		negativeAction: null,
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
		// same as for STATUS_RECEIVED
		titleKey: tk('submission.list.reviewAssignment.statusComplete.title'),
		// same as for STATUS_RECEIVED
		descriptionKey: tk(
			'submission.list.reviewAssignment.statusComplete.description',
		),
		textAction: null,
		primaryAction: 'viewRecommendation',
		negativeAction: null,
		dateToDisplay: 'dateCompleted',
	},

	// reviewer cancelled review request
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
		titleKey: tk('submission.list.reviewAssignment.statusCancelled.title'),
		descriptionKey: tk(
			'submission.list.reviewAssignment.statusCancelled.description',
		),
		textAction: 'resendReviewRequest',
		primaryAction: 'viewDetails',
		negativeAction: null,
		// TODO: its not tracked on backend
		dateToDisplay: 'dateConfirmed',
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
		titleKey: tk('submission.list.reviewAssignment.statusRequestResend.title'),
		descriptionKey: tk(
			'submission.list.reviewAssignment.statusRequestResend.description',
		),
		textAction: 'editDueDate',
		primaryAction: 'viewDetails',
		negativeAction: 'unassignReviewer',
		dateToDisplay: 'dateResponseDue',
	},
};

function calculateDaysBetweenDates(startDate, endDate) {
	const oneDay = 1000 * 60 * 60 * 24; // milliseconds in one day
	const start = new Date(startDate);
	const end = new Date(endDate);

	const difference = end - start; // difference in milliseconds

	return Math.round(difference / oneDay);
}

function getDays(config, reviewAssignment) {
	if (config.dateToDisplay) {
		return calculateDaysBetweenDates(
			new Date(),
			reviewAssignment[config.dateToDisplay],
		);
	}

	return null;
}

export function useReviewActivityIndicatorLogic() {
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
			? getDays(config, reviewAssignment)
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

			return null;
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

		function getReviewMethodIcons() {
			switch (reviewAssignment.reviewMethod) {
				case pkp.const.SUBMISSION_REVIEW_METHOD_ANONYMOUS:
					return ['OpenReview', 'AnonymousReview'];
				case pkp.const.SUBMISSION_REVIEW_METHOD_DOUBLEANONYMOUS:
					return ['AnonymousReview', 'AnonymousReview'];
				case pkp.const.SUBMISSION_REVIEW_METHOD_OPEN:
					return ['OpenReview', 'OpenReview'];
			}
			return ['OpenReview', 'OpenReview'];
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
			reviewMethodIcons: getReviewMethodIcons(),
			textButton: config.textAction && {
				action: config.textAction,
				label: getTextActionLabel(),
			},
			primaryButton: config.primaryAction && {
				action: config.primaryAction,
				label: getPrimaryActionLabel(),
			},
			negativeButton: config.negativeAction && {
				action: config.negativeAction,
				label: getNegativeActionLabel(),
			},
			reviewerName: 'TODO',
		};
	}
	return {
		getReviewActivityIndicatorProps,
		getReviewActivityIndicatorPopoverProps,
	};
}
