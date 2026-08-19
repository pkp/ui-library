<template>
	<FormDisplayItemBasic
		:heading-element="headingElement"
		:heading="field.label"
		:value="value"
	/>
</template>

<script setup>
import {computed} from 'vue';
import FormDisplayItemBasic from './FormDisplayItemBasic.vue';

const props = defineProps({
	field: {type: Object, required: true},
	headingElement: {required: true, type: String},
});

const value = computed(() => {
	// An option's value can be 0, so only an absent answer shows a dash
	if (props.field.value != null) {
		const selectedOption = props.field.options.find(
			(option) => option.value === props.field.value,
		);
		if (selectedOption) {
			return selectedOption.label;
		}
	}
	return '-';
});
</script>
