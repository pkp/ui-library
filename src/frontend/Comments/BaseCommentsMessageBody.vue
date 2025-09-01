<template>
	<div v-strip-unsafe-html="currentMessage.commentText.trim()"></div>
</template>
<script setup>
import {inject} from 'vue';
const currentMessage = inject('currentMessage');

console.log('currentMessage:', currentMessage);
</script>
