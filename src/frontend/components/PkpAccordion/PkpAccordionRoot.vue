<template>
	<AccordionRoot
		:class="cn('root')"
		:type="type"
		:collapsible="collapsible"
		:default-value="defaultValue"
		:model-value="modelValue"
		@update:model-value="$emit('update:modelValue', $event)"
	>
		<slot />
	</AccordionRoot>
</template>
<script setup>
import {AccordionRoot} from 'reka-ui';
import {usePkpStyles} from '@/frontend/composables/usePkpStyles.js';

const props = defineProps({
	type: {type: String, default: 'single'},
	collapsible: {type: Boolean, default: true},
	defaultValue: {type: [String, Number, Array], default: null},
	modelValue: {type: [String, Number, Array], default: undefined},
	styles: {type: Object, default: () => ({})},
});

defineEmits(['update:modelValue']);

const {cn} = usePkpStyles(props.styles);
</script>
