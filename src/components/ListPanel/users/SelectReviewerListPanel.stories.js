import SelectReviewerListPanel from './SelectReviewerListPanel.vue';

import ReviewerMock from '@/mocks/reviewer';

export default {
	title: 'ListPanel/SelectReviewerListPanel',
	component: SelectReviewerListPanel,
	parameters: {
		date: new Date('January 7, 2024 10:00:00'),
	},
};

const yesterday = new Date('Tue Dec 19 2023 16:00:27 GMT+0100');
yesterday.setDate(new Date('Tue Dec 19 2023 16:00:27 GMT+0100').getDate() - 1);

const items = [
	ReviewerMock,
	{
		...ReviewerMock,
		id: 2,
		fullName: 'Allison Ackerman',
		reviewsActive: 0,
		reviewsCompleted: 0,
		dateLastReviewAssignment: '',
		reviewerRating: null,
		interests: [],
	},
	{
		...ReviewerMock,
		id: 3,
		fullName: 'Aisla McCrae',
		reviewsActive: 23,
		reviewsCompleted: 32,
		dateLastReviewAssignment: '2022-12-31 11:22:42',
		reviewerRating: 5,
		orcid: 'http://orcid.org/0000-0002-1825-0097',
		orcidDisplayValue: 'http://orcid.org/0000-0002-1825-0097',
		biography: {
			en: '<p>Professor Aisla McCrae is a senior research fellow in the Publishing Studies Department in the School of Publishing at the University of Manitoba. She is the deputy chair of the Manitoba Publishing Institute and the author of <em>Publishing Now and Forever: Recent Developments in Archival Permanence</em>.</p>',
		},
		gossip:
			"<p>Aisla is a terrific reviewer but she takes a while to confirm and complete a review. Recommend not using her if you're on a tight deadline.</p>",
	},
	{
		...ReviewerMock,
		id: 4,
		fullName: 'Ahmed Maliki',
		reviewsActive: 0,
		reviewsCompleted: 2,
		dateLastReviewAssignment: yesterday.toString(),
		reviewerRating: 4,
		interests: [
			{
				id: 223,
				interest: 'catapulting into space',
			},
			{
				id: 224,
				interest: 'somersaults around the moon',
			},
			{
				id: 225,
				interest: 'listening to taylor swift',
			},
			{
				id: 227,
				interest: 'growing plants and stuff',
			},
			{
				id: 226,
				interest: 'just kickin it',
			},
		],
	},
	{
		...ReviewerMock,
		id: 5,
		fullName: 'Adela Gallego',
		reviewsActive: 1,
		reviewsCompleted: 0,
		dateLastReviewAssignment: '2022-01-25 11:22:42',
		reviewerRating: 5,
	},
	{
		...ReviewerMock,
		id: 6,
		fullName: 'Habiba Yousef',
		reviewsActive: 1,
		reviewsCompleted: 0,
		dateLastReviewAssignment: '2022-06-07 11:22:42',
		reviewerRating: 3,
	},
	{
		...ReviewerMock,
		id: 7,
		fullName: 'Matthew McMatherson',
		reviewsActive: 0,
		reviewsCompleted: 3,
		dateLastReviewAssignment: '2022-10-21 11:22:42',
		reviewerRating: 2,
	},
];

export const Base = {
	render: (args) => ({
		components: {SelectReviewerListPanel},
		setup() {
			function setData(id, newData) {
				Object.keys(newData).forEach((key) => {
					if (args[key]) {
						args[key] = newData[key];
					}
				});
			}

			return {args, setData};
		},
		template: `
			<SelectReviewerListPanel
				v-bind="args"
			/>
		`,
	}),

	args: {
		id: 'previewSelectReviewerListPanel',
		apiUrl: 'http://httpbin.org/get',
		activeReviewsCountLabel: '{$count} active',
		activeReviewsLabel: 'Active reviews currently assigned',
		assignedToLastRoundLabel:
			'This reviewer completed a review in the last round.',
		averageCompletionLabel: 'Average days to complete review',
		biographyLabel: 'Biography',
		cancelledReviewsLabel: 'Reviews cancelled',
		completedReviewsLabel: 'Reviews completed',
		currentlyAssigned: [5],
		currentlyAassignedLabel:
			'This reviewer has already been assigned to this review round.',
		daySinceLastAssignmentLabel: 'Yesterday',
		daysSinceLastAssignmentLabel: '{$days} days ago',
		daysSinceLastAssignmentDescriptionLabel: 'Days since last review assigned',
		declinedReviewsLabel: 'Reviews declined',
		emptyLabel: 'No reviewers found',
		gossipLabel: 'Editorial Notes',
		items: [...items],
		lastRoundReviewers: items.filter((reviewer) =>
			[3, 4].includes(reviewer.id),
		),
		itemsMax: items.length,
		neverAssignedLabel: 'Never assigned',
		reassignLabel: 'Reassign',
		reassignWithNameLabel: 'Reassign {$name}',
		reviewerRatingLabel: 'Reviewer rating: {$rating}',
		reviewInterestsLabel: 'Reviewing Interests',
		selectReviewerLabel: 'Select Reviewer',
		selectorName: 'reviewerId',
		title: 'Locate a Reviewer',
		warnOnAssignment: [7],
		warnOnAssignmentLabel:
			"This reviewer is locked because they have been assigned a role which allows them to view the author's identity. Anonymous peer review can not be guaranteed. Would you like to unlock this reviewer anyway?",
		warnOnAssignmentUnlockLabel: 'Unlock',

		filters: [
			{
				param: 'reviewerRating',
				title: 'Rated at least',
				value: 3,
				min: 1,
				max: 5,
				useStars: true,
				valueLabel: '{$value}/5',
			},
			{
				param: 'reviewsCompleted',
				title: 'Reviews completed',
				value: 10,
				min: 0,
				max: 20,
				valueLabel: '{$value} or more',
			},
			{
				param: 'daysSinceLastAssignment',
				title: 'Days since last review assigned',
				filterType: 'filter-slider-multirange',
				value: [0, 365],
				min: 0,
				max: 365,
				valueLabel: '{$min}-{$max}',
				moreThanLabel: 'More than',
				lessThanLabel: 'Less than',
			},
			{
				param: 'reviewsActive',
				title: 'Active reviews currently assigned',
				filterType: 'filter-slider-multirange',
				value: [0, 20],
				min: 0,
				max: 20,
				valueLabel: '{$min}-{$max}',
				moreThanLabel: 'More than',
				lessThanLabel: 'Less than',
			},
			{
				param: 'averageCompletion',
				title: 'Average days to complete review',
				value: 75,
				min: 0,
				max: 75,
				valueLabel: '{$value} or less',
			},
		],
	},
};
