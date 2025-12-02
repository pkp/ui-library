<template>
	<AccordionItem class="BaseOpenReviewRound" :value="round.roundId">
		<slot />
	</AccordionItem>
</template>
<script setup>
import {AccordionItem} from 'reka-ui';
import {provide} from 'vue';

const props = defineProps({
	round: {type: Object, required: true},
});

provide('openReviewReviews', props.round.reviews);
</script>
