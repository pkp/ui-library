<template>
	<select-reviewer-list-panel
		apiUrl="http://httpbin.org/get"
		activeReviewsCountLabel="{$count} active"
		activeReviewsLabel="Active reviews currently assigned"
		assignedToLastRoundLabel="This reviewer completed a review in the last round."
		averageCompletionLabel="Average days to complete review"
		biographyLabel="Biography"
		cancelledReviewsLabel="Reviews cancelled"
		completedReviewsLabel="Reviews completed"
		:currentlyAssigned="[5]"
		currentlyAssignedLabel="This reviewer has already been assigned to this review round."
		daySinceLastAssignmentLabel="Yesterday"
		daysSinceLastAssignmentLabel="{$days} days ago"
		daysSinceLastAssignmentDescriptionLabel="Days since last review assigned"
		declinedReviewsLabel="Reviews declined"
		emptyLabel="No reviewers found"
		:filters="filters"
		gossipLabel="Editorial Notes"
		id="previewSelectReviewerListPanel"
		:items="items"
		:itemsMax="items.length"
		neverAssignedLabel="Never assigned"
		reassignLabel="Reassign"
		reassignWithNameLabel="Reassign {$name}"
		reviewerRatingLabel="Reviewer rating: {$rating}"
		reviewInterestsLabel="Reviewing Interests"
		selectReviewerLabel="Select Reviewer"
		selectorName="reviewerId"
		title="Locate a Reviewer"
		:warnOnAssignment="[7]"
		warnOnAssignmentLabel="This reviewer is locked because they have been assigned a role which allows them to view the author's identity. Anonymous peer review can not be guaranteed. Would you like to unlock this reviewer anyway?"
		warnOnAssignmentUnlockLabel="Unlock"
	/>
</template>
<script>
import SelectReviewerListPanel from '@/components/ListPanel/users/SelectReviewerListPanel.vue';
import reviewer from '@/docs/data/reviewer';

export default {
	components: {
		SelectReviewerListPanel
	},
	data() {
		const yesterday = new Date();
		yesterday.setDate(new Date().getDate() - 1);

		const items = [
			reviewer,
			{
				...reviewer,
				id: 2,
				fullName: 'Allison Ackerman',
				reviewsActive: 0,
				reviewsCompleted: 0,
				dateLastReviewAssignment: '',
				reviewerRating: null,
				interests: []
			},
			{
				...reviewer,
				id: 3,
				fullName: 'Aisla McCrae',
				reviewsActive: 23,
				reviewsCompleted: 32,
				dateLastReviewAssignment: '2019-12-31 11:22:42',
				reviewerRating: 5,
				orcid: 'http://orcid.org/0000-0002-1825-0097',
				biography: {
					en_US:
						'<p>Professor Aisla McCrae is a senior research fellow in the Publishing Studies Department in the School of Publishing at the University of Manitoba. She is the deputy chair of the Manitoba Publishing Institute and the author of <em>Publishing Now and Forever: Recent Developments in Archival Permanence</em>.</p>'
				},
				gossip:
					"<p>Aisla is a terrific reviewer but she takes a while to confirm and complete a review. Recommend not using her if you're on a tight deadline.</p>"
			},
			{
				...reviewer,
				id: 4,
				fullName: 'Ahmed Maliki',
				reviewsActive: 0,
				reviewsCompleted: 2,
				dateLastReviewAssignment: yesterday.toString(),
				reviewerRating: 4,
				interests: [
					{
						id: 223,
						interest: 'catapulting into space'
					},
					{
						id: 224,
						interest: 'somersaults around the moon'
					},
					{
						id: 225,
						interest: 'listening to taylor swift'
					},
					{
						id: 227,
						interest: 'growing plants and stuff'
					},
					{
						id: 226,
						interest: 'just kickin it'
					}
				]
			},
			{
				...reviewer,
				id: 5,
				fullName: 'Adela Gallego',
				reviewsActive: 1,
				reviewsCompleted: 0,
				dateLastReviewAssignment: '2019-01-25 11:22:42',
				reviewerRating: 5
			},
			{
				...reviewer,
				id: 6,
				fullName: 'Habiba Yousef',
				reviewsActive: 1,
				reviewsCompleted: 0,
				dateLastReviewAssignment: '2019-06-07 11:22:42',
				reviewerRating: 3
			},
			{
				...reviewer,
				id: 7,
				fullName: 'Matthew McMatherson',
				reviewsActive: 0,
				reviewsCompleted: 3,
				dateLastReviewAssignment: '2017-10-21 11:22:42',
				reviewerRating: 2
			}
		];

		return {
			filters: [
				{
					param: 'reviewerRating',
					title: 'Rated at least',
					value: 3,
					min: 1,
					max: 5,
					useStars: true,
					valueLabel: '{$value}/5'
				},
				{
					param: 'reviewsCompleted',
					title: 'Reviews completed',
					value: 10,
					min: 0,
					max: 20,
					valueLabel: '{$value} or more'
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
					lessThanLabel: 'Less than'
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
					lessThanLabel: 'Less than'
				},
				{
					param: 'averageCompletion',
					title: 'Average days to complete review',
					value: 75,
					min: 0,
					max: 75,
					valueLabel: '{$value} or less'
				}
			],
			items: [...items]
		};
	}
};
</script>
