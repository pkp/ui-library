<template>
	<li class="BaseOpenReviewListItem">
		<slot />
	</li>
</template>
<script setup>
import {provide} from 'vue';

const props = defineProps({
	review: {type: Object, required: true},
});

provide('openReviewListItem', props.review);
</script>
