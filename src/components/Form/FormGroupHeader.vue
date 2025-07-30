<template>
	<component
		:is="headingElement"
		class="mb-2 inline-block text-2xl-bold font-bold"
	>
		{{ heading }}
	</component>
	<div
		v-if="description"
		v-strip-unsafe-html="description"
		class="semantic-defaults text-lg-normal"
	></div>
</template>

<script setup>
defineProps({
	heading: {
		type: String,
		default: () => '',
	},
	headingElement: {
		type: String,
		default: () => 'h3',
	},
	description: {
		type: String,
		default: () => '',
	},
});
</script>
