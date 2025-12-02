<template>
	<button class="BaseOpenReviewReadButton" @click="handleClick">
		<slot>Read Review</slot>
	</button>
</template>
<script setup>
import {inject} from 'vue';

const review = inject('openReviewListItem', null);

const emit = defineEmits(['click']);

function handleClick() {
	emit('click', review);
}
</script>
