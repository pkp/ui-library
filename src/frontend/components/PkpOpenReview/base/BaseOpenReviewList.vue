<template>
	<ul class="BaseOpenReviewList">
		<template v-for="(review, index) in reviews" :key="review.id">
			<slot :review="review" :index="index" />
		</template>
	</ul>
</template>
<script setup>
import {inject, computed} from 'vue';

// Inject reviews from parent (BaseOpenReviewRound or BaseOpenReviewReviewer)
const injectedReviews = inject('openReviewReviews', []);

const reviews = computed(() => injectedReviews || []);
</script>
