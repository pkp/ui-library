<template>
	<div>
		<slot :message="currentMessage"></slot>
	</div>
</template>
<script setup>
import {inject} from 'vue';
const currentMessage = inject('currentMessage');
</script>
