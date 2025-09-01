<template>
	<span>{{ messageProps.message.userOrcidDisplayValue }}</span>
</template>
<script setup>
import {inject} from 'vue';

const messageProps = inject('messageProps');
</script>
