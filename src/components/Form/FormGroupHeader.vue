<template>
	<legend v-if="label" class="text-lg mb-2 inline-block font-bold">
		{{ label }}
	</legend>
	<div
		v-if="description"
		v-strip-unsafe-html="description"
		class="semantic-defaults text-lg-normal"
	></div>
</template>

<script setup>
defineProps({
	label: {
		type: String,
		default: '',
	},
	description: {
		type: String,
		default: '',
	},
});
</script>
