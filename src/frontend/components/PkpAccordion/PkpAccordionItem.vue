<template>
	<AccordionItem :class="cn('root')" :value="value">
		<slot />
	</AccordionItem>
</template>
<script setup>
import {AccordionItem} from 'reka-ui';
import {usePkpStyles} from '@/frontend/composables/usePkpStyles.js';

const props = defineProps({
	value: {type: [String, Number], required: true},
	styles: {type: Object, default: () => ({})},
});

const {cn} = usePkpStyles('PkpAccordionItem', props.styles);
</script>
