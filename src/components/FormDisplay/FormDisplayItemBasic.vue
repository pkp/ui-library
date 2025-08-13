<template>
	<div>
		<component :is="headingElement" class="mb-1 inline-block text-xl-bold">
			{{ heading }}
		</component>
		<div class="flex items-center">
			<p v-if="!htmlValue" class="text-lg-normal">{{ value }}</p>
			<p v-else v-strip-unsafe-html="htmlValue" class="text-lg-normal"></p>
			<slot name="valueSuffix"></slot>
		</div>
	</div>
</template>

<script setup>
defineProps({
	headingElement: {required: true, type: String},
	heading: {type: String, required: true},
	value: {type: String, required: false, default: '-'},
	htmlValue: {type: String, required: false, default: null},
});
</script>
