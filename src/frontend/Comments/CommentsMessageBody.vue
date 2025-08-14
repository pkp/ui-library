<template>
	<span>
		{{ currentMessage.body }}
	</span>
</template>
<script setup>
import {inject} from 'vue';
const currentMessage = inject('currentMessage');

console.log('currentMessage:', currentMessage);
</script>
