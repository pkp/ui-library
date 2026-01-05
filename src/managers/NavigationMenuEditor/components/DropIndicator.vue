<template>
	<div
		v-if="visible"
		class="pointer-events-none"
		:class="{
			'absolute inset-x-0 -top-0.5 z-10': position === 'before',
			'absolute inset-x-0 -bottom-0.5 z-10': position === 'after',
			'absolute inset-0 z-10': position === 'inside',
		}"
	>
		<!-- Line indicator for before/after -->
		<div
			v-if="isLine"
			class="h-0.5 rounded-full bg-primary"
			:style="indicatorStyle"
		></div>

		<!-- Background highlight for inside (nesting) -->
		<div
			v-else
			class="h-full rounded border-2 border-dashed border-primary bg-primary/10"
			:style="indicatorStyle"
		></div>
	</div>
</template>

<script setup>
import {computed} from 'vue';

const props = defineProps({
	/**
	 * Position indicator type
	 */
	position: {
		type: String,
		required: true,
		validator: (value) => ['before', 'after', 'inside'].includes(value),
	},
	/**
	 * Whether the indicator is visible
	 */
	visible: {
		type: Boolean,
		default: false,
	},
	/**
	 * Indentation level (1-based)
	 */
	depth: {
		type: Number,
		default: 1,
	},
	/**
	 * Pixels per indent level
	 */
	indentPerLevel: {
		type: Number,
		default: 24,
	},
});

const indicatorStyle = computed(() => {
	const indent = (props.depth - 1) * props.indentPerLevel;
	return {
		marginInlineStart: `${indent}px`,
	};
});

const isLine = computed(() => {
	return props.position === 'before' || props.position === 'after';
});
</script>
