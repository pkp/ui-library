<template>
	<PkpPopover>
		<template #button>
			<ReviewActivityIndicator
				v-bind="reviewActivityIndicatorProps"
			></ReviewActivityIndicator>
		</template>

		<div class="flex">
			<Badge v-bind="config.badgeProps">
				{{ title }}
			</Badge>
		</div>
		<div class="flex items-start justify-between pt-5">
			<span class="text-lg-bold">{{ reviewerName }}</span>
			<span class="space-x-2">
				<Icon
					v-for="icon in reviewMethodIcons"
					:key="icon"
					class="h-6 w-6"
					:icon="icon"
				/>
			</span>
		</div>
		<div class="mt-1 border-t border-light pt-4 text-start text-base-normal">
			<p v-html="description"></p>
		</div>
		<div class="-ms-3 text-start">
			<PkpButton
				v-if="textActionLabel"
				:is-link="true"
				@click="() => triggerEmit(config.textAction)"
			>
				{{ textActionLabel }}
			</PkpButton>
		</div>
		<div class="mt-4 flex">
			<PkpButton
				v-if="primaryActionLabel"
				@click="() => triggerEmit(config.primaryAction)"
			>
				{{ primaryActionLabel }}
			</PkpButton>
			<PkpButton
				v-if="negativeActionLabel"
				class="ms-4"
				:is-warnable="true"
				@click="() => triggerEmit(config.negativeAction)"
			>
				{{ negativeActionLabel }}
			</PkpButton>
		</div>
	</PkpPopover>
</template>
<script>
import {useLocalize} from '@/composables/useLocalize';

const {tk} = useLocalize();

// mocked until thats implemented in https://github.com/pkp/pkp-lib/issues/9799
pkp.const.REVIEW_ASSIGNMENT_STATUS_VIEWED = 15;

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
export default {};
</script>
<script setup>
import {defineProps, computed} from 'vue';
import ReviewActivityIndicator from './ReviewActivityIndicator.vue';
import Badge from '@/components/Badge/Badge.vue';
import Icon from '@/components/Icon/Icon.vue';
import PkpButton from '@/components/Button/Button.vue';
import PkpPopover from '@/components/Popover/Popover.vue';

const {t} = useLocalize();

const props = defineProps({
	reviewerName: {type: String, required: true},
	submissionId: {type: Number, required: true},
	/**
	 * @typedef {Object} ReviewAssignment
	 * @property {Number} id - review assignment id
	 * @property {Number} statusId - statusId, can be check against pkp.const.REVIEW_ASSIGNMENT_STATUS*
	 * @property {String} dateDue - Review due date
	 * @property {String} dateResponseDue - Review response due date
	 * @property {Number} reviewMethod - review method, can be checked against pkp.const.pkp.const.SUBMISSION_REVIEW_METHOD*
	 * @property {?Number} recommendation - recommendation, can be checked against pkp.const.SUBMISSION_REVIEWER_RECOMMENDATION*

	 */
	reviewAssignment: {
		type: Object,
		required: true,
		validator(value) {
			return (
				'id' in value &&
					typeof value.id === 'number' &&
					'statusId' in value &&
					ReviewAssignmentStatuses.includes(value.statusId) &&
					'dateDue' in value &&
					typeof value.dateDue === 'string' &&
					'dateResponseDue' in value &&
					typeof value.dateResponseDue === 'string' &&
					'reviewMethod' in value &&
					ReviewMethods.includes(value.reviewMethod),
				'recommendation' in value &&
					(Recommendations.includes(value.recommendation) ||
						value.recommendation == null)
			);
		},
	},
});

const emit = defineEmits([
	'resendReviewRequest',
	'viewDetails',
	'editDueDate',
	'unassignReviewer',
	'cancelReviewer',
	'viewRecommendation',
]);

const config = computed(() => {
	const configBase = ConfigPerStatus[props.reviewAssignment.statusId];

	return configBase;
});

function calculateDaysBetweenDates(startDate, endDate) {
	const oneDay = 1000 * 60 * 60 * 24; // milliseconds in one day
	const start = new Date(startDate);
	const end = new Date(endDate);

	const difference = end - start; // difference in milliseconds

	return Math.round(difference / oneDay);
}

const date = computed(() => {
	if (config.value.dateToDisplay) {
		return props.reviewAssignment[config.value.dateToDisplay];
	}

	return null;
});

const recommendation = computed(() => {
	return RecommendationTranslations[props.reviewAssignment.recommendation]
		? t(RecommendationTranslations[props.reviewAssignment.recommendation])
		: null;
});

const days = computed(() => {
	if (config.value.dateToDisplay) {
		return calculateDaysBetweenDates(
			new Date(),
			props.reviewAssignment[config.value.dateToDisplay],
		);
	}

	return null;
});

const reviewActivityIndicatorProps = computed(() => {
	const reviewActivityConfig = config.value.reviewActivityIndicator;

	const displayProgress = reviewActivityConfig.displayVariant === 'progress';
	let progress = null;

	if (displayProgress) {
		const start = new Date(props.reviewAssignment.dateAssigned);
		const end = new Date(props.reviewAssignment[config.value.dateToDisplay]);
		const today = new Date();

		progress = 100 * (1 - (today - start) / (end - start));
	}
	// show days if icon is not defined in config
	const text = !reviewActivityConfig.icon ? days.value : null;

	return {
		...reviewActivityConfig,
		text,
		progress,
	};
});

const title = computed(() => {
	return t(config.value.titleKey, {
		date: date.value,
		days: Math.abs(days.value),
	});
});

const description = computed(() => {
	return t(config.value.descriptionKey, {
		date: date.value,
		days: Math.abs(days.value),
		recommendation: recommendation.value,
	});
});
const reviewMethodIcons = computed(() => {
	switch (props.reviewAssignment.reviewMethod) {
		case pkp.const.SUBMISSION_REVIEW_METHOD_ANONYMOUS:
			return ['OpenReview', 'AnonymousReview'];
		case pkp.const.SUBMISSION_REVIEW_METHOD_DOUBLEANONYMOUS:
			return ['AnonymousReview', 'AnonymousReview'];
		case pkp.const.SUBMISSION_REVIEW_METHOD_OPEN:
			return ['OpenReview', 'OpenReview'];
	}
	return ['OpenReview', 'OpenReview'];
});

const textActionLabel = computed(() => {
	if (!config.value.textAction) {
		return null;
	}
	return t(ActionButtonTranslations[config.value.textAction]);
});

const primaryActionLabel = computed(() => {
	if (!config.value.primaryAction) {
		return null;
	}
	return t(ActionButtonTranslations[config.value.primaryAction]);
});

const negativeActionLabel = computed(() => {
	if (!config.value.negativeAction) {
		return null;
	}
	return t(ActionButtonTranslations[config.value.negativeAction]);
});

function triggerEmit(action) {
	emit(action, props.submissionId, props.reviewAssignment.id);
}
</script>
