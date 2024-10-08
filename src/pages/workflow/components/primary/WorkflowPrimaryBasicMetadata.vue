<template>
	<div class="border border-light p-4">
		<h3 v-if="heading" class="mb-2 text-lg-bold text-heading">{{ heading }}</h3>
		<p v-if="body" class="text-sm-normal">{{ body }}</p>
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
