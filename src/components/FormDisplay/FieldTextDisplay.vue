<template>
	<FormDisplayItemBasic
		:heading-element="headingElement"
		:heading="field.label"
		:value="field.value"
	/>
</template>

<script setup>
import FormDisplayItemBasic from './FormDisplayItemBasic.vue';

defineProps({
	field: {type: Object, required: true},
	headingElement: {required: true, type: String},
});
</script>
