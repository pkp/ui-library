import ReviewActivityIndicatorPopup from './ReviewActivityIndicatorPopover.vue';

export default {
	title: 'Components/ReviewActivityIndicatorPopup',
	component: ReviewActivityIndicatorPopup,
	render: (args) => ({
		components: {ReviewActivityIndicatorPopup},
		setup() {
			console.log('stories setup indicator');
			console.log(args.test);
			return {args};
		},
		template:
			'<ReviewActivityIndicatorPopup v-bind="args"></ReviewActivityIndicatorPopup>',
	}),
	decorators: [
		() => ({
			template:
				'<div style="text-align:center; width: 400px; height: 300px"><story/></div>',
		}),
	],
};

export const Declined = {
	args: {
		reviewerName: 'Julie Janssen',
		submissionId: 15,
		reviewAssignment: {
			id: 5,
			statusId: pkp.const.REVIEW_ASSIGNMENT_STATUS_DECLINED,
			due: '2024-03-25',
			responseDue: '2024-03-15',
			dateConfirmed: '2024-03-13',
			dateAssigned: '2024-02-15',
			reviewMethod: pkp.const.SUBMISSION_REVIEW_METHOD_ANONYMOUS,
		},
	},
};

export const AwaitingResponse = {
	args: {
		reviewerName: 'Julie Janssen',
		submissionId: 15,
		reviewAssignment: {
			id: 5,
			statusId: pkp.const.REVIEW_ASSIGNMENT_STATUS_AWAITING_RESPONSE,
			due: '2024-03-25',
			responseDue: '2024-03-15',
			dateAssigned: '2024-02-15',
			//dateConfirmed: '2024-03-13',
			reviewMethod: pkp.const.SUBMISSION_REVIEW_METHOD_ANONYMOUS,
		},
	},
};
