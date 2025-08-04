<template>
	<AccordionRoot
		:class="accordionClass"
		type="single"
		:default-value="defaultOpen ? 'item-1' : undefined"
		collapsible
	>
		<AccordionItem class="pkp-accordion__item" value="item-1">
			<AccordionHeader class="pkp-accordion__header">
				<AccordionTrigger class="pkp-accordion__trigger">
					{{ title }}
					<span class="pkp-accordion__chevron">▼</span>
				</AccordionTrigger>
			</AccordionHeader>
			<AccordionContent class="pkp-accordion__content">
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

const accordionClass = computed(() => ['pkp-accordion']);
</script>

<style>
.pkp-accordion {
	width: 100%;
}

.pkp-accordion__item {
	border-bottom: 1px solid var(--pkp-border-color-light);
}

.pkp-accordion__header {
	margin: 0;
}

.pkp-accordion__trigger {
	display: flex;
	align-items: center;
	justify-content: space-between;
	width: 100%;
	padding: var(--pkp-spacing-2) var(--pkp-spacing-3);
	background-color: var(--pkp-background-color-tertiary);
	color: var(--pkp-text-color-secondary);
	font: var(--pkp-font-base-bold);
	border: none;
	cursor: pointer;
	text-align: left;
}

.pkp-accordion__trigger:hover {
	background-color: var(--pkp-background-color-selection-light);
}

.pkp-accordion__trigger[data-state='open'] {
	background-color: var(--pkp-background-color-default);
}

.pkp-accordion__trigger[data-state='open'] .pkp-accordion__chevron {
	transform: rotate(180deg);
}

.pkp-accordion__chevron {
	display: inline-block;
	color: var(--pkp-text-color-secondary);
	font-size: var(--pkp-text-lg-normal);
}

.pkp-accordion__content {
	overflow: hidden;
	background-color: var(--pkp-background-color-secondary);
	padding: var(--pkp-spacing-3);
}
</style>
