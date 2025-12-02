<template>
	<div class="BaseOpenReview">
		<slot />
	</div>
</template>
<script setup>
import {provide, computed} from 'vue';

const props = defineProps({
	openReview: {type: Object, required: true},
});

// Provide review data to all child components
provide('openReview', props.openReview);
provide(
	'openReviewRounds',
	computed(() => props.openReview?.reviewRounds || []),
);
</script>
