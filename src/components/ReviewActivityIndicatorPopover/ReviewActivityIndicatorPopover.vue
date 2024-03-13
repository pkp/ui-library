<template>
	<PkpPopover>
		<template #button>
			<ReviewActivityIndicator
				v-bind="reviewActivityIndicatorProps"
			></ReviewActivityIndicator>
		</template>

		<div>
			<Badge v-bind="popoverConfig.badgeProps">
				<div :class="badgeTextColorClass" class="flex items-center">
					<Icon
						class="h-5 w-5"
						:icon="popoverConfig.badgeIcon"
						:inline="true"
					/>
					<span>{{ title }}</span>
				</div>
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
		<div
			class="mt-1 border-t border-light pt-4 text-start text-base-normal"
			v-html="description"
		></div>
		<div class="-ms-3 text-start">
			<PkpButton
				v-if="textActionLabel"
				:is-link="true"
				@click="() => triggerEmit(popoverConfig.textAction)"
			>
				{{ textActionLabel }}
			</PkpButton>
		</div>
		<div class="mt-4">
			<PkpButton
				v-if="primaryActionLabel"
				@click="() => triggerEmit(popoverConfig.primaryAction)"
			>
				{{ primaryActionLabel }}
			</PkpButton>
			<PkpButton
				v-if="negativeActionLabel"
				class="ms-4"
				:is-warnable="true"
				@click="() => triggerEmit(popoverConfig.negativeAction)"
			>
				{{ negativeActionLabel }}
			</PkpButton>
		</div>
	</PkpPopover>
</template>
<script>
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

// TODO colors to be replaced with css variables
const ReviewIndicatorPropsBase = {
	[pkp.const.REVIEW_ASSIGNMENT_STATUS_DECLINED]: {
		icon: 'ReviewRequestDeclined',
		colorVariant: 'negative',
		displayVariant: 'fill',
	},
	[pkp.const.REVIEW_ASSIGNMENT_STATUS_AWAITING_RESPONSE]: {
		colorVariant: 'awaiting',
		displayVariant: 'progress',
		progress: 50,
		text: 10,
	},
};

const PopoverConfigPerStatus = {
	[pkp.const.REVIEW_ASSIGNMENT_STATUS_DECLINED]: {
		badgeIcon: 'ReviewRequestDeclined',
		badgeProps: {
			isWarnable: true,
		},
		badgeTextColorClass: 'text-lightest',
		titleKey: 'submission.list.reviewAssignment.statusDeclined.title',
		titleDate: 'dateConfirmed',
		descriptionKey:
			'submission.list.reviewAssignment.statusDeclined.description',
		descriptionDate: 'dateConfirmed',
		indicateDays: '',
		textAction: 'resendReviewRequest',
		primaryAction: 'viewDetails',
		negativeAction: 'cancelReviewer',
	},
	[pkp.const.REVIEW_ASSIGNMENT_STATUS_AWAITING_RESPONSE]: {
		badgeIcon: 'ReviewSent',
		badgeProps: {
			stage: 'review',
		},
		badgeTextColorClass: 'text-lightest',
		titleKey: 'submission.list.reviewAssignment.statusDeclined.title',
		titleDate: 'dateConfirmed',
		descriptionKey:
			'submission.list.reviewAssignment.statusDeclined.description',
		descriptionDate: 'dateConfirmed',
		textAction: 'resendReviewRequest',
		primaryAction: 'viewDetails',
		negativeAction: 'cancelReviewer',
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
import {useLocalize} from '@/composables/useLocalize';

const {t} = useLocalize();

const props = defineProps({
	reviewerName: {type: String, required: true},
	submissionId: {type: Number, required: true},
	/**
	 * @typedef {Object} ReviewAssignment
	 * @property {Number} id - review assignment id
	 * @property {Number} statusId - statusId, can be check with pkp.const.REVIEW_ASSIGNMENT_STATUS*
	 * @property {String} due - Review due date
	 * @property {String} responseDue - Review response due date
	 * @property {Number} reviewMethod - review method, can be checked with pkp.const.pkp.const.SUBMISSION_REVIEW_METHOD*
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
				'due' in value &&
				typeof value.due === 'string' &&
				'responseDue' in value &&
				typeof value.responseDue === 'string' &&
				'reviewMethod' in value &&
				ReviewMethods.includes(value.reviewMethod)
			);
		},
	},
});

const emit = defineEmits([
	'resendReviewRequest',
	'viewDetails',
	'cancelReviewer',
]);

const reviewActivityIndicatorProps = computed(() => {
	const baseProps = ReviewIndicatorPropsBase[props.reviewAssignment.statusId];

	return baseProps;
});

const popoverConfig = computed(() => {
	const configBase = PopoverConfigPerStatus[props.reviewAssignment.statusId];

	return configBase;
});

const title = computed(() => {
	let date = null;
	if (popoverConfig.value.descriptionDate) {
		date = props.reviewAssignment[popoverConfig.value.titleDate];
	}
	// TODO add formatting date
	return t(popoverConfig.value.titleKey, {date});
});

const description = computed(() => {
	let date = null;
	if (popoverConfig.value.descriptionDate) {
		date = props.reviewAssignment[popoverConfig.value.descriptionDate];
	}

	// TODO add formatting date
	return t(popoverConfig.value.descriptionKey, {date});
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
	switch (popoverConfig.value.textAction) {
		case 'resendReviewRequest':
			return t('submission.list.reviewAssignment.action.resendReviewRequest');
	}

	return null;
});

const primaryActionLabel = computed(() => {
	switch (popoverConfig.value.primaryAction) {
		case 'viewDetails':
			return t('submission.list.reviewAssignment.action.viewDetails');
	}

	return null;
});

const negativeActionLabel = computed(() => {
	switch (popoverConfig.value.negativeAction) {
		case 'cancelReviewer':
			return t('submission.list.reviewAssignment.action.cancelReviewer');
	}

	return null;
});

/*function calculateDaysBetweenDates(startDate, endDate) {
	const oneDay = 1000 * 60 * 60 * 24; // milliseconds in one day
	const start = new Date(startDate);
	const end = new Date(endDate);
	const difference = end - start; // difference in milliseconds
	return Math.round(difference / oneDay);
}*/

/*const days = computed(() => {
	return calculateDaysBetweenDates(
		props.reviewAssignment.dateAssigned,
		props.reviewAssignment.responseDue,
	);
});*/

function triggerEmit(action) {
	emit(action, props.submissionId, props.reviewAssignment.id);
}
</script>
