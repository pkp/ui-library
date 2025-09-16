<template>
	<div><slot></slot></div>
</template>
<script setup>
import {provide, useId} from 'vue';
const props = defineProps({
	label: {
		type: String,
		default: '',
	},
	modelValue: {
		type: String,
		default: '',
	},
	placeholder: {
		type: String,
		default: '',
	},
	disabled: {
		type: Boolean,
		default: false,
	},
});

const emit = defineEmits(['update:modelValue']);
const textAreaId = useId();

provide('textAreaProps', props);
provide('textAreaEmit', emit);
provide('textAreaId', textAreaId);
</script>
