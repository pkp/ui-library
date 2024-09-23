<template>
	<div class="flex flex-col">
		<span
			v-if="title"
			:class="{
				'text-base-bold': true,
				'text-default': !isNegative,
				'text-negative': isNegative,
			}"
			:title="tooltip ? tooltip : undefined"
		>
			{{ title }}
		</span>
		<span v-if="description" class="text-sm-normal text-secondary">
			{{ description }}
		</span>
		<span v-if="recommendation" class="text-sm-normal text-secondary">
			{{ recommendation }}
		</span>
		<span v-if="competingInterest" class="text-sm-normal text-secondary">
			{{ competingInterest }}
		</span>
	</div>
</template>

<script setup>
defineProps({
	title: {type: String, required: false, default: null},
	description: {type: String, required: false, default: null},
	isNegative: {type: Boolean, required: false, default: false},
	tooltip: {type: String, required: false, default: null},
	recommendation: {type: String, required: false, default: null},
	competingInterest: {type: String, required: false, default: null},
});
</script>
