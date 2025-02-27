<template>
	<component :is="headingElement" class="text-base-normal text-secondary">
		{{ heading }}
	</component>
	<p v-if="!htmlValue" class="pt-1 text-lg-normal">{{ value }}</p>
	<p v-else v-strip-unsafe-html="htmlValue" class="pt-1 text-lg-normal"></p>
</template>

<script setup>
defineProps({
	headingElement: {required: true, type: String},
	heading: {type: String, required: true},
	value: {type: String, required: false, default: '-'},
	htmlValue: {type: String, required: false, default: null},
});
</script>
