<template>
	<div
		:id="`${groupId}_label`"
		class="mb-2 inline-block text-2xl-bold font-bold"
	>
		{{ label }}
	</div>
	<div
		v-if="description"
		:id="`${groupId}_description`"
		v-strip-unsafe-html="description"
		class="semantic-defaults text-lg-normal"
	></div>
</template>

<script setup>
defineProps({
	groupId: {
		type: String,
		required: true,
	},
	label: {
		type: String,
		default: () => '',
	},
	description: {
		type: String,
		default: () => '',
	},
});
</script>
