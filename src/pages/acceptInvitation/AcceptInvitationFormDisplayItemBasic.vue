<template>
	<component :is="headingElement" :class="headingClass">
		{{ heading }}
	</component>
	<div class="flex items-center">
		<p v-if="!htmlValue" class="pt-1 text-lg-normal">{{ value }}</p>
		<p v-else v-strip-unsafe-html="htmlValue" class="pt-1 text-lg-normal"></p>
		<slot name="valueSuffix"></slot>
	</div>
</template>

<script setup>
defineProps({
	headingElement: {required: true, type: String},
	headingClass: {
		type: String,
		required: false,
		default: 'text-base-normal text-secondary',
	},
	heading: {type: String, required: true},
	value: {type: String, required: false, default: '-'},
	htmlValue: {type: String, required: false, default: null},
});
</script>
