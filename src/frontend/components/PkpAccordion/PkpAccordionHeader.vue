<template>
	<AccordionHeader class="PkpAccordionHeader" :as="as">
		<AccordionTrigger class="PkpAccordionHeader__trigger">
			<slot />
			<span v-if="!hideChevron" class="PkpAccordionHeader__chevron">
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

defineProps({
	as: {type: String, default: 'h3'},
	hideChevron: {type: Boolean, default: false},
});
</script>

<style>
.PkpAccordionHeader__trigger {
	display: flex;
	align-items: center;
	justify-content: space-between;
	width: 100%;
	cursor: pointer;
}

.PkpAccordionHeader__chevron {
	transition: transform 0.2s;
}

.PkpAccordionHeader__chevron svg {
	width: 1rem;
	height: 1rem;
}

[data-state='open']
	> .PkpAccordionHeader__trigger
	.PkpAccordionHeader__chevron {
	transform: rotate(180deg);
}
</style>
