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
		<div
			v-if="isLine"
			class="h-0.5 rounded-full bg-primary"
			:style="indicatorStyle"
		></div>
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
	position: {
		type: String,
		required: true,
		validator: (value) => ['before', 'after', 'inside'].includes(value),
	},
	visible: {
		type: Boolean,
		default: false,
	},
	depth: {
		type: Number,
		default: 1,
	},
	indentPerLevel: {
		type: Number,
		default: 24,
	},
});

const indicatorStyle = computed(() => ({
	marginInlineStart: `${(props.depth - 1) * props.indentPerLevel}px`,
}));

const isLine = computed(
	() => props.position === 'before' || props.position === 'after',
);
</script>
