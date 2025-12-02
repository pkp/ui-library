<template>
	<AccordionRoot
		class="BaseAccordionRoot"
		:type="type"
		:collapsible="collapsible"
		:default-value="defaultValue"
	>
		<slot />
	</AccordionRoot>
</template>
<script setup>
import {AccordionRoot} from 'reka-ui';

defineProps({
	type: {type: String, default: 'single'},
	collapsible: {type: Boolean, default: true},
	defaultValue: {type: [String, Number], default: null},
});
</script>
