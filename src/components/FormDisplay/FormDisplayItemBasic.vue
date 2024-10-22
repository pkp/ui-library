<template>
	<component :is="headingElement" class="text-base-normal text-secondary">
		{{ heading }}
	</component>
	<p class="pt-1 text-lg-normal">{{ value }}</p>
</template>

<script setup>
defineProps({
	headingElement: {required: true, type: String},
	heading: {type: String, required: true},
	value: {type: String, required: false, default: '-'},
});
</script>
