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

// Ids must be Strings to match reka-ui's AccordionItem contract and its strict
// `.includes()` comparison. Callers with numeric ids should coerce at the call
// site (e.g. `:value="String(publication.id)"`).
const props = defineProps({
	type: {type: String, default: 'single'},
	collapsible: {type: Boolean, default: true},
	defaultValue: {type: [String, Array], default: null},
	modelValue: {type: [String, Array], default: undefined},
	styles: {type: Object, default: () => ({})},
});

defineEmits(['update:modelValue']);

const {cn} = usePkpStyles('PkpAccordionRoot', props.styles);
</script>
