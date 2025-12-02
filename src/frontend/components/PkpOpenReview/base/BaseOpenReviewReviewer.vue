<template>
	<AccordionItem class="BaseOpenReviewReviewer" :value="reviewer.reviewerId">
		<slot />
	</AccordionItem>
</template>
<script setup>
import {AccordionItem} from 'reka-ui';
import {provide} from 'vue';

const props = defineProps({
	reviewer: {type: Object, required: true},
});

provide('openReviewReviews', props.reviewer.reviews);
</script>
