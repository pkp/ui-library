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
import {AccordionRoot} from 'reka-ui';
import {computed} from 'vue';

const props = defineProps({
	rounds: {type: Array, required: true},
	defaultExpanded: {type: [Number, String], default: null},
});

const defaultValue = computed(() => {
	// If defaultExpanded is provided, use it; otherwise expand the first round
	if (props.defaultExpanded !== null) {
		return props.defaultExpanded;
	}
	return props.rounds.length > 0 ? props.rounds[0].roundId : null;
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
		.map(([recommendation, count]) => ({recommendation, count}));
}
</script>
