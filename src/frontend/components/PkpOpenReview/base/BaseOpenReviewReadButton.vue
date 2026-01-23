<template>
	<button class="BaseOpenReviewReadButton" @click="handleClick">
		<slot>Read Review</slot>
	</button>
</template>

<script setup>
import {usePkpOpenReviewStore} from '../usePkpOpenReviewStore';

const props = defineProps({
	review: {type: Object, required: true},
});

const store = usePkpOpenReviewStore();

function handleClick() {
	store.openReview(props.review);
}
</script>

<style>
.BaseOpenReviewReadButton {
	padding: 0.5rem 1rem;
	background: #fff;
	border: 1px solid #1a56db;
	border-radius: 0.375rem;
	font-size: 0.875rem;
	font-weight: 500;
	color: #1a56db;
	cursor: pointer;
	white-space: nowrap;
	margin-left: auto;
}

.BaseOpenReviewReadButton:hover {
	background: #1a56db;
	color: #fff;
}
</style>
