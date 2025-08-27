<template>
	<span>{{ currentMessage.author.orcid }}</span>
</template>
<script setup>
import {inject} from 'vue';

const currentMessage = inject('currentMessage');
</script>
