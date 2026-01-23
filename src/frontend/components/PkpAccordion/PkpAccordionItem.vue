<template>
	<AccordionItem class="PkpAccordionItem" :value="value">
		<slot />
	</AccordionItem>
</template>
<script setup>
import {AccordionItem} from 'reka-ui';

defineProps({
	value: {type: [String, Number], required: true},
});
</script>
