<template>
	<button class="PkpOpenReview__read-btn" @click="handleClick">
		<slot>{{ t('openReview.readReview') }}</slot>
	</button>
</template>

<script setup>
import {usePkpOpenReviewStore} from '../usePkpOpenReviewStore';
import {usePkpLocalize} from '@/frontend/composables/usePkpLocalize';

const props = defineProps({
	review: {type: Object, required: true},
	contextReviews: {type: Array, required: true},
});

const store = usePkpOpenReviewStore();
const {t} = usePkpLocalize();

function handleClick() {
	store.openReview(props.review, props.contextReviews);
}
</script>

<style>
.PkpOpenReview__read-btn {
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

.PkpOpenReview__read-btn:hover {
	background: #1a56db;
	color: #fff;
}
</style>
