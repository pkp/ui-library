<template>
	<div class="flex items-center space-x-2">
		<div v-if="alert">{{ alert }}</div>
	</div>
</template>

<script setup>
defineProps({
	alert: {type: String, required: false, default: null},
});
</script>
