<template>
	<span>{{ currentMessage.author.name }}</span>
</template>
<script setup>
import {inject} from 'vue';

const currentMessage = inject('currentMessage');
</script>
