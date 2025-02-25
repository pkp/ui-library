import ReviewActivityIndicatorPopover from './ReviewActivityIndicatorPopover.vue';
import PkpPopover from '@/components/Popover/Popover.vue';
import ReviewActivityIndicator from './ReviewActivityIndicator.vue';
import {useDashboardConfigReviewActivity} from '@/pages/dashboard/composables/useDashboardConfigReviewActivity';

export default {
	title: 'Components/ReviewActivityIndicatorPopup',
	component: ReviewActivityIndicatorPopover,
	render: (args) => ({
		components: {
			ReviewActivityIndicatorPopover,
			PkpPopover,
			ReviewActivityIndicator,
		},
		setup() {
			const {
				getReviewActivityIndicatorProps,
				getReviewActivityIndicatorPopoverProps,
			} = useDashboardConfigReviewActivity();

			return {
				args,
				getReviewActivityIndicatorProps,
				getReviewActivityIndicatorPopoverProps,
			};
		},
		template: `
		<PkpPopover>
				<template #button>
					<ReviewActivityIndicator
						v-bind="getReviewActivityIndicatorProps({reviewAssignment: args.reviewAssignment})"
					></ReviewActivityIndicator>
				</template>
				<ReviewActivityIndicatorPopover
					v-bind="getReviewActivityIndicatorPopoverProps({reviewAssignment: args.reviewAssignment})"
				/>
		</PkpPopover>
`,
	}),
	decorators: [
		() => ({
			template:
				'<div style="text-align:center; width: 400px; height: 300px"><story/></div>',
		}),
	],
	parameters: {
		date: new Date('March 11, 2024 10:00:00'),
	},
};

export const AwaitingResponse = {
	args: {
		submissionId: 15,
		reviewAssignment: {
			id: 5,
			reviewerFullName: 'Julie Janssen',
			statusId: pkp.const.REVIEW_ASSIGNMENT_STATUS_AWAITING_RESPONSE,
			dateDue: '2024-03-25',
			dateResponseDue: '2024-04-30',
			dateAssigned: '2024-02-01',
			dateConfirmed: '2024-03-13',
			reviewMethod: pkp.const.SUBMISSION_REVIEW_METHOD_ANONYMOUS,
			recommendation: null,
		},
	},
};

export const Declined = {
	args: {
		submissionId: 15,
		reviewAssignment: {
			id: 5,
			reviewerFullName: 'Julie Janssen',
			statusId: pkp.const.REVIEW_ASSIGNMENT_STATUS_DECLINED,
			dateDue: '2024-03-25',
			dateResponseDue: '2024-03-15',
			dateConfirmed: '2024-03-13',
			dateAssigned: '2024-02-15',
			reviewMethod: pkp.const.SUBMISSION_REVIEW_METHOD_ANONYMOUS,
			recommendation: null,
		},
	},
};

export const ResponseOverdue = {
	args: {
		submissionId: 15,
		reviewAssignment: {
			id: 5,
			reviewerFullName: 'Julie Janssen',
			statusId: pkp.const.REVIEW_ASSIGNMENT_STATUS_RESPONSE_OVERDUE,
			dateDue: '2024-03-25',
			dateResponseDue: '2024-03-08',
			dateAssigned: '2024-02-15',
			reviewMethod: pkp.const.SUBMISSION_REVIEW_METHOD_ANONYMOUS,
			recommendation: null,
		},
	},
};

export const Accepted = {
	args: {
		submissionId: 15,
		reviewAssignment: {
			id: 5,
			reviewerFullName: 'Julie Janssen',
			statusId: pkp.const.REVIEW_ASSIGNMENT_STATUS_ACCEPTED,
			dateDue: '2024-03-25',
			dateResponseDue: '2024-03-08',
			dateAssigned: '2024-02-15',
			reviewMethod: pkp.const.SUBMISSION_REVIEW_METHOD_ANONYMOUS,
			recommendation: null,
		},
	},
};

export const ReviewOverdue = {
	args: {
		submissionId: 15,
		reviewAssignment: {
			id: 5,
			reviewerFullName: 'Julie Janssen',
			statusId: pkp.const.REVIEW_ASSIGNMENT_STATUS_REVIEW_OVERDUE,
			dateDue: '2024-02-10',
			dateResponseDue: '2024-03-08',
			dateAssigned: '2024-02-15',
			reviewMethod: pkp.const.SUBMISSION_REVIEW_METHOD_ANONYMOUS,
			recommendation: null,
		},
	},
};

export const Received = {
	args: {
		submissionId: 15,
		reviewAssignment: {
			id: 5,
			reviewerFullName: 'Julie Janssen',
			statusId: pkp.const.REVIEW_ASSIGNMENT_STATUS_RECEIVED,
			dateDue: '2024-02-10',
			dateResponseDue: '2024-03-08',
			dateAssigned: '2024-02-15',
			dateCompleted: '2024-03-13',
			reviewMethod: pkp.const.SUBMISSION_REVIEW_METHOD_ANONYMOUS,
			recommendation:
				pkp.const.SUBMISSION_REVIEWER_RECOMMENDATION_RESUBMIT_HERE,
		},
	},
};

export const Viewed = {
	args: {
		submissionId: 15,
		reviewAssignment: {
			id: 5,
			reviewerFullName: 'Julie Janssen',
			statusId: pkp.const.REVIEW_ASSIGNMENT_STATUS_VIEWED,
			dateDue: '2024-02-10',
			dateResponseDue: '2024-03-08',
			dateAssigned: '2024-02-15',
			dateCompleted: '2024-03-13',
			reviewMethod: pkp.const.SUBMISSION_REVIEW_METHOD_ANONYMOUS,
			recommendation:
				pkp.const.SUBMISSION_REVIEWER_RECOMMENDATION_RESUBMIT_HERE,
		},
	},
};

export const Complete = {
	args: {
		submissionId: 15,
		reviewAssignment: {
			id: 5,
			reviewerFullName: 'Julie Janssen',
			statusId: pkp.const.REVIEW_ASSIGNMENT_STATUS_COMPLETE,
			dateDue: '2024-02-10',
			dateResponseDue: '2024-03-08',
			dateAssigned: '2024-02-15',
			dateCompleted: '2024-03-13',
			reviewMethod: pkp.const.SUBMISSION_REVIEW_METHOD_ANONYMOUS,
			recommendation: pkp.const.SUBMISSION_REVIEWER_RECOMMENDATION_ACCEPT,
		},
	},
};

// Currently exactly same as completed
export const Thanked = {
	args: {
		submissionId: 15,
		reviewAssignment: {
			id: 5,
			reviewerFullName: 'Julie Janssen',
			statusId: pkp.const.REVIEW_ASSIGNMENT_STATUS_THANKED,
			dateDue: '2024-02-10',
			dateResponseDue: '2024-03-08',
			dateAssigned: '2024-02-15',
			dateCompleted: '2024-03-13',
			reviewMethod: pkp.const.SUBMISSION_REVIEW_METHOD_ANONYMOUS,
			recommendation: pkp.const.SUBMISSION_REVIEWER_RECOMMENDATION_ACCEPT,
		},
	},
};

export const Cancelled = {
	args: {
		submissionId: 15,
		reviewAssignment: {
			id: 5,
			reviewerFullName: 'Julie Janssen',
			statusId: pkp.const.REVIEW_ASSIGNMENT_STATUS_CANCELLED,
			dateDue: '2024-02-10',
			dateResponseDue: '2024-03-08',
			dateAssigned: '2024-02-15',
			dateConfirmed: '2024-03-11',
			reviewMethod: pkp.const.SUBMISSION_REVIEW_METHOD_ANONYMOUS,
			recommendation: pkp.const.SUBMISSION_REVIEWER_RECOMMENDATION_ACCEPT,
		},
	},
};

export const RequestResend = {
	args: {
		submissionId: 15,
		reviewAssignment: {
			id: 5,
			reviewerFullName: 'Julie Janssen',
			statusId: pkp.const.REVIEW_ASSIGNMENT_STATUS_REQUEST_RESEND,
			dateDue: '2024-02-10',
			dateResponseDue: '2024-03-08',
			dateAssigned: '2024-02-15',
			dateCompleted: '2024-03-13',
			reviewMethod: pkp.const.SUBMISSION_REVIEW_METHOD_ANONYMOUS,
			recommendation: pkp.const.SUBMISSION_REVIEWER_RECOMMENDATION_ACCEPT,
		},
	},
};
