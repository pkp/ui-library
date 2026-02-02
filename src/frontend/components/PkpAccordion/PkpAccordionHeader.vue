<template>
	<AccordionHeader :class="cn('root')" :as="as">
		<AccordionTrigger :class="cn('trigger')">
			<span :class="cn('content')">
				<slot />
			</span>
			<span :class="cn('indicator')">
				<slot name="indicator">
					<PkpIcon icon="ChevronDown" />
				</slot>
			</span>
		</AccordionTrigger>
	</AccordionHeader>
</template>

<script setup>
import {AccordionHeader, AccordionTrigger} from 'reka-ui';
import {usePkpStyles} from '@/frontend/composables/usePkpStyles.js';
import PkpIcon from '@/frontend/components/PkpIcon/PkpIcon.vue';

const props = defineProps({
	as: {type: String, default: 'h3'},
	styles: {type: Object, default: () => ({})},
});

const {cn} = usePkpStyles('PkpAccordionHeader', props.styles);
</script>
