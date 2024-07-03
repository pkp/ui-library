<template>
	<div class="gap flex flex-col gap-y-10">
		<div v-for="field in fields" :key="field.name">
			<component
				:is="FieldComponents[field.component] || `${field.component}-display`"
				:field="field"
				:heading-element="headingElement"
			></component>
		</div>
	</div>
</template>

<script setup>
import FieldTextDisplay from './FieldTextDisplay.vue';
import FieldSelectDisplay from './FieldSelectDisplay.vue';

const FieldComponents = {
	'field-text': FieldTextDisplay,
	'field-select': FieldSelectDisplay,
};

defineProps({
	fields: {type: Array, required: true},
	headingElement: {required: false, default: 'h4', type: String},
});
</script>
