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
	if (props.field.value) {
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
