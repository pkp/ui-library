<template>
	<AccordionRoot
		class="BaseOpenReviewRounds"
		type="single"
		collapsible
		:default-value="defaultValue"
	>
		<template v-for="(round, index) in rounds" :key="round.roundId">
			<slot :round="round" :index="index" :summary="getRoundSummary(round)" />
		</template>
	</AccordionRoot>
</template>
<script setup>
import {inject, computed} from 'vue';
import {AccordionRoot} from 'reka-ui';

/**
 * Labels for recommendation summary badges
 */
const recommendationLabels = {
	approved: 'Approved',
	revisions_requested: 'Revisions Requested',
	not_approved: 'Not Approved',
	comments: 'Comments',
};

const props = defineProps({
	defaultExpanded: {type: [Number, String], default: null},
});

// Inject review rounds from BaseOpenReview
const openReviewRounds = inject('openReviewRounds');
const rounds = computed(() => openReviewRounds?.value || []);

const defaultValue = computed(() => {
	if (props.defaultExpanded !== null) {
		return props.defaultExpanded;
	}
	return rounds.value.length > 0 ? rounds.value[0].roundId : null;
});

/**
 * Calculate summary counts for each recommendation type in a round
 */
function getRoundSummary(round) {
	const counts = {
		approved: 0,
		revisions_requested: 0,
		not_approved: 0,
		comments: 0,
	};

	for (const review of round.reviews || []) {
		if (review.recommendation && counts[review.recommendation] !== undefined) {
			counts[review.recommendation]++;
		}
	}

	// Return only non-zero counts as array for easy iteration
	return Object.entries(counts)
		.filter(([, count]) => count > 0)
		.map(([recommendation, count]) => ({
			recommendation,
			count,
			label: recommendationLabels[recommendation],
		}));
}
</script>
