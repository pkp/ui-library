<template>
	<div class="BaseOpenReview">
		<slot />
	</div>
</template>
<script setup>
import {provide, computed} from 'vue';

const props = defineProps({
	openReviewData: {type: Object, required: true},
});

// Provide review data to all child components
provide('openReviewData', props.openReviewData);
provide(
	'openReviewRounds',
	computed(() => props.openReviewData?.reviewRounds || []),
);
</script>
