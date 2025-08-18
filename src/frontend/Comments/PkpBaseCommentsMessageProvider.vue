<template>
	<slot />
</template>

<script setup>
import {provide} from 'vue';

const props = defineProps({
	message: {
		type: Object,
		required: true,
	},
});
console.log('providing:', props.message);
provide('currentMessage', props.message);
</script>
