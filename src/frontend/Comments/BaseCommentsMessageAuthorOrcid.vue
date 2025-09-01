<template>
	<span>{{ currentMessage.userOrcidDisplayValue }}</span>
</template>
<script setup>
import {inject} from 'vue';

const currentMessage = inject('currentMessage');
</script>
