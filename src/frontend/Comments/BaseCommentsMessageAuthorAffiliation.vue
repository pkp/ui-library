<template>
	<span>{{ currentMessage.userAffiliation }}</span>
</template>
<script setup>
import {inject} from 'vue';

const currentMessage = inject('currentMessage');
</script>
