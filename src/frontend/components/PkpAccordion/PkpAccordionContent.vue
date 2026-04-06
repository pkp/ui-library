<template>
	<AccordionContent :class="cn('root')">
		<slot />
	</AccordionContent>
</template>
<script setup>
import {AccordionContent} from 'reka-ui';
import {usePkpStyles} from '@/frontend/composables/usePkpStyles.js';

const props = defineProps({
	styles: {type: Object, default: () => ({})},
});

const {cn} = usePkpStyles('PkpAccordionContent', props.styles);
</script>
