<template>
	<slot :message="currentMessage"></slot>
</template>
<script setup>
import {inject} from 'vue';
const currentMessage = inject('currentMessage');
</script>
