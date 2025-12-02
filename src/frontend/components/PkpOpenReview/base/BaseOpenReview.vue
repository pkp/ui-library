<template>
	<div class="BaseOpenReview">
		<slot />
	</div>
</template>
<script setup>
import {usePkpOpenReviewStore} from '../usePkpOpenReviewStore';

const props = defineProps({
	openReviewData: {type: Object, required: true},
});

// Initialize the store
const store = usePkpOpenReviewStore();
store.initialize({openReviewData: props.openReviewData});
</script>
