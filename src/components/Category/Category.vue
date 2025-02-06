<template>
	<div>{{ categories }} {{ apiUrl }}</div>
</template>

<script setup>
defineProps({
	categories: {
		type: Array,
		required: true,
		validator: (value) => {
			return true;
		},
	},

	apiUrl: {
		type: String,
		default: '',
	},
});
</script>
