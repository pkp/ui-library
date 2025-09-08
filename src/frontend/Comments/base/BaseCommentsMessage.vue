<template>
	<div class="BaseCommentsMessage">
		<slot :message="message"></slot>
	</div>
</template>
<script setup>
import {provide} from 'vue';

const props = defineProps({message: {type: Object, required: true}});
provide('messageProps', props);
</script>
