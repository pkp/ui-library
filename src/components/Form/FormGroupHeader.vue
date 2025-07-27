<template>
	<component
		:is="headingElement"
		class="mb-2 inline-block text-xl-bold font-bold"
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
		default: () => 'h4',
	},
	description: {
		type: String,
		default: () => '',
	},
});
</script>
