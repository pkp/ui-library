<template>
	<FormDisplayItemBasic
		:heading-element="headingElement"
		:heading="field.label"
		:value="values"
	/>
</template>

<script setup>
import {computed} from 'vue';
import FormDisplayItemBasic from './FormDisplayItemBasic.vue';

const props = defineProps({
	field: {type: Object, required: true},
	headingElement: {required: true, type: String},
	displayLocale: {required: true, type: String, default: ''},
});

const values = computed(() => {
	const entries = props.displayLocale
		? props.field.value[props.displayLocale]
		: props.field.value;

	if (!Array.isArray(entries)) {
		return '';
	}

	return entries.map((entry) => entry.label ?? entry.name ?? entry).join(', ');
});
</script>
