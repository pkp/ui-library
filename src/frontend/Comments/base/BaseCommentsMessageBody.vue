<template>
	<div
		v-strip-unsafe-html="messageProps.message.commentText.trim()"
		class="BaseCommentsMessageBody"
	></div>
</template>
<script setup>
import {inject} from 'vue';
const messageProps = inject('messageProps');
</script>
