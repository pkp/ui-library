<template>
	<AccordionHeader :class="cn('root')" :as="as">
		<AccordionTrigger :class="cn('trigger')">
			<span :class="cn('content')">
				<slot />
			</span>
			<span
				v-if="indicator !== 'none'"
				:class="cn('indicator')"
				:data-indicator="indicator"
			>
				<slot name="indicator" :open="isOpen">
					<PkpIcon icon="ChevronDown" />
				</slot>
			</span>
		</AccordionTrigger>
	</AccordionHeader>
</template>

<script setup>
import {
	AccordionHeader,
	AccordionTrigger,
	injectAccordionItemContext,
} from 'reka-ui';
import {computed} from 'vue';
import {usePkpStyles} from '@/frontend/composables/usePkpStyles.js';
import PkpIcon from '@/frontend/components/PkpIcon/PkpIcon.vue';

const props = defineProps({
	as: {type: String, default: 'h3'},
	indicator: {
		type: String,
		default: 'rotate',
		validator: (v) => ['rotate', 'static', 'none'].includes(v),
	},
	styles: {type: Object, default: () => ({})},
});

const {cn} = usePkpStyles('PkpAccordionHeader', props.styles);
const itemContext = injectAccordionItemContext();
const isOpen = computed(() => itemContext.open.value);
</script>
