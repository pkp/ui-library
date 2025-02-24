<template>
	<div class="flex items-center gap-x-2">
		<div v-if="alert">{{ alert }}</div>
	</div>
</template>

<script setup>
defineProps({
	alert: {type: String, required: false, default: null},
});
</script>
