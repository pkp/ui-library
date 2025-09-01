<template>
	<span>{{ messageProps.message.date }}</span>
</template>
<script setup>
import {inject} from 'vue';

const messageProps = inject('messageProps');
</script>
