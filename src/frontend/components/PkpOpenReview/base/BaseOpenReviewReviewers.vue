<template>
	<AccordionRoot
		class="BaseOpenReviewReviewers"
		type="single"
		collapsible
		:default-value="defaultValue"
	>
		<template
			v-for="(reviewer, index) in reviewerGroups"
			:key="reviewer.reviewerId"
		>
			<slot
				:reviewer="reviewer"
				:index="index"
				:review-count="reviewer.reviews?.length || 0"
			/>
		</template>
	</AccordionRoot>
</template>
<script setup>
import {inject, computed} from 'vue';
import {AccordionRoot} from 'reka-ui';

const props = defineProps({
	defaultExpanded: {type: [Number, String], default: null},
});

// Inject review rounds from BaseOpenReview
const openReviewRounds = inject('openReviewRounds');

/**
 * Group reviews by reviewer for the "by reviewer" view
 */
const reviewerGroups = computed(() => {
	const reviewRounds = openReviewRounds?.value || [];
	const reviewerMap = new Map();

	for (const round of reviewRounds) {
		for (const review of round.reviews || []) {
			const reviewerId = review.reviewerId;

			if (!reviewerMap.has(reviewerId)) {
				reviewerMap.set(reviewerId, {
					reviewerId: reviewerId,
					reviewerFullName: review.reviewerFullName,
					reviewerAffiliation: review.reviewerAffiliation,
					reviews: [],
				});
			}

			// Add review with round context
			reviewerMap.get(reviewerId).reviews.push({
				...review,
				roundDisplayText: round.displayText,
				roundDate: round.date,
				roundId: round.roundId,
			});
		}
	}

	// Sort by reviewer name and return as array
	return Array.from(reviewerMap.values()).sort((a, b) =>
		a.reviewerFullName.localeCompare(b.reviewerFullName),
	);
});

const defaultValue = computed(() => {
	if (props.defaultExpanded !== null) {
		return props.defaultExpanded;
	}
	return reviewerGroups.value.length > 0
		? reviewerGroups.value[0].reviewerId
		: null;
});
</script>
