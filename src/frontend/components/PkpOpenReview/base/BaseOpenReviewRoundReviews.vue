<template>
	<ul class="BaseOpenReviewRoundReviews">
		<template v-for="(review, index) in reviews" :key="review.id">
			<slot :review="review" :index="index" />
		</template>
	</ul>
</template>
<script setup>
import {inject, computed} from 'vue';

const props = defineProps({
	reviews: {type: Array, default: null},
});

const round = inject('openReviewRound', null);

const reviews = computed(() => {
	// Use prop if provided, otherwise get from injected round
	return props.reviews ?? round?.reviews ?? [];
});
</script>
