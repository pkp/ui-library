import PkpOpenReview from './PkpOpenReview.vue';

export default {
	title: 'Comments',
	component: PkpOpenReview,
	render: (args) => ({
		components: {PkpOpenReview},
		setup() {
			return {args};
		},
		template: '<PkpOpenReview v-bind="args"></Comments>',
	}),
};

export const Primary = {
	args: {
		reviews: {
			publicationId: 5,
			reviewRounds: [
				{
					displayText: 'Author Original 1.0 (Round 1)',
					roundId: 18,
					reviews: [
						{
							id: 48,
							reviewerId: 9,
							reviewerFullName: 'Aisla McCrae',
							reviewerAffiliation: 'University of Manitoba',
							dateAssigned: '2025-10-13 17:08:57',
							dateConfirmed: '2025-10-13 17:09:25',
							dateCompleted: '2025-10-13 17:11:05',
							declined: false,
							reviewerRecommendationDisplayText: 'Resubmit for Review',
							reviewerRecommendationId: 3,
							reviewForm: {
								id: 4,
								description: '<p>This is another review form</p>',
								title: 'Another Review Form',
								questions: [
									{
										question: '<p>Select All options that describes you</p>',
										responses: ['Well Read'],
									},
									{
										question: '<p>One More question</p>',
										responses: ['Option B'],
									},
									{
										question: '<p>Third Question</p>',
										responses: ['a discussion'],
									},
									{
										question: '<p>A Radio Button Question</p>',
										responses: ['Button C'],
									},
								],
							},
							reviewerComments: null,
						},
					],
				},
			],
		},
	},
};
