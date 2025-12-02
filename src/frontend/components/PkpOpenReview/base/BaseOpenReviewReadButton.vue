<template>
	<button class="BaseOpenReviewReadButton" @click="handleClick">
		<slot>Read Review</slot>
	</button>
</template>
<script setup>
import {inject} from 'vue';
import {usePkpOpenReviewStore} from '../usePkpOpenReviewStore';

const store = usePkpOpenReviewStore();
const review = inject('openReviewListItem', null);

function handleClick() {
	if (review) {
		store.openReview(review);
	}
}
</script>
