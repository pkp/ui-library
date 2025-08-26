<template>
	<AccordionRoot
		:class="accordionClass"
		type="single"
		:default-value="defaultOpen ? 'item-1' : undefined"
		collapsible
	>
		<AccordionItem class="pkpAccordion__item" value="item-1">
			<AccordionHeader class="pkpAccordion__header">
				<AccordionTrigger class="pkpAccordion__trigger">
					{{ title }}
					<span class="pkpAccordion__chevron">▼</span>
				</AccordionTrigger>
			</AccordionHeader>
			<AccordionContent class="pkpAccordion__content">
				<slot />
			</AccordionContent>
		</AccordionItem>
	</AccordionRoot>
</template>

<script setup>
import {computed} from 'vue';
import {
	AccordionRoot,
	AccordionItem,
	AccordionHeader,
	AccordionTrigger,
	AccordionContent,
} from 'reka-ui';

defineProps({
	title: {
		type: String,
		default: '',
	},
	defaultOpen: {
		type: Boolean,
		default: false,
	},
});

const accordionClass = computed(() => ['pkpAccordion']);
</script>

<style>
.pkpAccordion {
	width: 100%;
}

.pkpAccordion__item {
	border-bottom: 1px solid var(--pkp-border-color-light);
}

.pkpAccordion__header {
	margin: 0;
}

.pkpAccordion__trigger {
	display: flex;
	align-items: center;
	justify-content: space-between;
	width: 100%;
	padding: var(--pkp-spacing-2) var(--pkp-spacing-3);
	background-color: var(--pkp-background-color-tertiary);
	color: var(--pkp-text-color-heading);
	font: var(--pkp-font-base-bold);
	border: none;
	cursor: pointer;
	text-align: left;
}

.pkpAccordion__trigger:hover {
	background-color: var(--pkp-background-color-selection-light);
}

.pkpAccordion__trigger[data-state='open'] {
	background-color: var(--pkp-background-color-default);
}

.pkpAccordion__trigger[data-state='open'] .pkpAccordion__chevron {
	transform: rotate(180deg);
}

.pkpAccordion__chevron {
	display: inline-block;
	color: var(--pkp-text-color-secondary);
	font-size: var(--pkp-text-lg-normal);
}

.pkpAccordion__content {
	overflow: hidden;
	background-color: var(--pkp-background-color-secondary);
	padding: var(--pkp-spacing-3);
}
</style>
