<template>
	<div>
		<slot :message="message"></slot>
	</div>
</template>
<script setup>
import {provide} from 'vue';

const props = defineProps({message: {type: Object, required: true}});
console.log('BaseCommentsMessage props:', props);
provide('messageProps', props);
</script>
