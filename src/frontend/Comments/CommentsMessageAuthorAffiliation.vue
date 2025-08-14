<template>
	<span>{{ currentMessage.author.affiliation }}</span>
</template>
<script setup>
import {inject} from 'vue';

const currentMessage = inject('currentMessage');
</script>
