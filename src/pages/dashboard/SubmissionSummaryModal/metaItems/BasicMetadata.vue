<template>
	<div>
		<h3 class="text-lg-bold text-heading">{{ heading }}:</h3>
		<p class="text-base-normal">{{ body }}</p>
	</div>
</template>
<script setup>
defineProps({
	heading: {
		type: String,
		required: true,
	},
	body: {type: String, required: true},
});
</script>
