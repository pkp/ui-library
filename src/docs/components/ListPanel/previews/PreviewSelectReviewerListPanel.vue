<template>
	<select-reviewer-list-panel
		id="previewSelectReviewerListPanel"
		api-url="http://httpbin.org/get"
		active-reviews-count-label="{$count} active"
		active-reviews-label="Active reviews currently assigned"
		assigned-to-last-round-label="This reviewer completed a review in the last round."
		average-completion-label="Average days to complete review"
		biography-label="Biography"
		cancelled-reviews-label="Reviews cancelled"
		completed-reviews-label="Reviews completed"
		:currently-assigned="[5]"
		currently-assigned-label="This reviewer has already been assigned to this review round."
		day-since-last-assignment-label="Yesterday"
		days-since-last-assignment-label="{$days} days ago"
		days-since-last-assignment-description-label="Days since last review assigned"
		declined-reviews-label="Reviews declined"
		empty-label="No reviewers found"
		:filters="filters"
		gossip-label="Editorial Notes"
		:items="items"
		:items-max="items.length"
		:last-round-reviewers="lastRoundReviewers"
		never-assigned-label="Never assigned"
		reassign-label="Reassign"
		reassign-with-name-label="Reassign {$name}"
		reviewer-rating-label="Reviewer rating: {$rating}"
		review-interests-label="Reviewing Interests"
		select-reviewer-label="Select Reviewer"
		selector-name="reviewerId"
		title="Locate a Reviewer"
		:warn-on-assignment="[7]"
		warn-on-assignment-label="This reviewer is locked because they have been assigned a role which allows them to view the author's identity. Anonymous peer review can not be guaranteed. Would you like to unlock this reviewer anyway?"
		warn-on-assignment-unlock-label="Unlock"
	/>
</template>
<script>
import SelectReviewerListPanel from '@/components/ListPanel/users/SelectReviewerListPanel.vue';
import reviewer from '@/docs/data/reviewer';

export default {
	components: {
		SelectReviewerListPanel,
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
				interests: [],
			},
			{
				...reviewer,
				id: 3,
				fullName: 'Aisla McCrae',
				reviewsActive: 23,
				reviewsCompleted: 32,
				dateLastReviewAssignment: '2022-12-31 11:22:42',
				reviewerRating: 5,
				orcid: 'http://orcid.org/0000-0002-1825-0097',
				biography: {
					en: '<p>Professor Aisla McCrae is a senior research fellow in the Publishing Studies Department in the School of Publishing at the University of Manitoba. She is the deputy chair of the Manitoba Publishing Institute and the author of <em>Publishing Now and Forever: Recent Developments in Archival Permanence</em>.</p>',
				},
				gossip:
					"<p>Aisla is a terrific reviewer but she takes a while to confirm and complete a review. Recommend not using her if you're on a tight deadline.</p>",
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
				...reviewer,
				id: 5,
				fullName: 'Adela Gallego',
				reviewsActive: 1,
				reviewsCompleted: 0,
				dateLastReviewAssignment: '2022-01-25 11:22:42',
				reviewerRating: 5,
			},
			{
				...reviewer,
				id: 6,
				fullName: 'Habiba Yousef',
				reviewsActive: 1,
				reviewsCompleted: 0,
				dateLastReviewAssignment: '2022-06-07 11:22:42',
				reviewerRating: 3,
			},
			{
				...reviewer,
				id: 7,
				fullName: 'Matthew McMatherson',
				reviewsActive: 0,
				reviewsCompleted: 3,
				dateLastReviewAssignment: '2022-10-21 11:22:42',
				reviewerRating: 2,
			},
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
			items: [...items],
			lastRoundReviewers: items.filter((reviewer) =>
				[3, 4].includes(reviewer.id),
			),
		};
	},
};
</script>
