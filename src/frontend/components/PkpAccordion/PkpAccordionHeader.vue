<template>
	<AccordionHeader :class="cn('root')" :as="as">
		<AccordionTrigger :class="cn('trigger')">
			<slot />
			<span v-if="!hideChevron" :class="cn('chevron')">
				<svg
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
				>
					<polyline points="6 9 12 15 18 9" />
				</svg>
			</span>
		</AccordionTrigger>
	</AccordionHeader>
</template>

<script setup>
import {AccordionHeader, AccordionTrigger} from 'reka-ui';
import {usePkpStyles} from '@/frontend/composables/usePkpStyles.js';

const props = defineProps({
	as: {type: String, default: 'h3'},
	hideChevron: {type: Boolean, default: false},
	styles: {type: Object, default: () => ({})},
});

const {cn} = usePkpStyles('PkpAccordionHeader', props.styles);
</script>
