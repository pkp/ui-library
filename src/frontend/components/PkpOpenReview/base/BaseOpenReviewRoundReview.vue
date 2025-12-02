<template>
	<li
		class="BaseOpenReviewRoundReview"
		:data-recommendation="review.recommendation"
	>
		<slot />
	</li>
</template>
<script setup>
import {provide} from 'vue';

const props = defineProps({
	review: {type: Object, required: true},
});

provide('openReviewRoundReview', props.review);
</script>
