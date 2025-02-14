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
		<span
			v-if="competingInterests"
			class="pt-0.5 text-sm-normal text-secondary"
		>
			<Badge size-variant="compact" color-variant="attention">
				{{ competingInterests }}
			</Badge>
		</span>
	</div>
</template>

<script setup>
import Badge from '@/components/Badge/Badge.vue';

defineProps({
	title: {type: String, required: false, default: null},
	description: {type: String, required: false, default: null},
	isNegative: {type: Boolean, required: false, default: false},
	tooltip: {type: String, required: false, default: null},
	recommendation: {type: String, required: false, default: null},
	competingInterests: {type: String, required: false, default: null},
});
</script>
