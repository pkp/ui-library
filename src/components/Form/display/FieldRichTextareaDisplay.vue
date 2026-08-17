<template>
	<FormDisplayItemBasic
		:heading-element="headingElement"
		:heading="field.label"
		:html-value="htmlValue"
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

const htmlValue = computed(() => {
	const value = props.displayLocale
		? props.field.value?.[props.displayLocale]
		: props.field.value;

	return value || '-';
});
</script>
