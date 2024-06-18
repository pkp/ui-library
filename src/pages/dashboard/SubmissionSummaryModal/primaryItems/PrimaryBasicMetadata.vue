<template>
	<div class="border border-light p-4">
		<h3 class="text-lg-bold text-heading">{{ heading }}</h3>
		<p class="pt-2 text-sm-normal">{{ body }}</p>
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
