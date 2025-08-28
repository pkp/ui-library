<template>
	<BaseButton class="pkpButton" v-bind="$attrs"><slot /></BaseButton>
</template>

<script setup>
import BaseButton from './BaseButton.vue';
</script>

<style>
.pkpButton {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	padding: var(--pkp-spacing-2) var(--pkp-spacing-4);
	font: var(--pkp-font-base-bold);
	border-radius: var(--pkp-radius);
	cursor: pointer;
	border: 1px solid var(--pkp-color-transparent);
	gap: var(--pkp-spacing-2);
}

.pkpButton:disabled {
	background-color: var(--pkp-background-color-disabled);
	color: var(--pkp-text-color-disabled);
	cursor: not-allowed;
	border-color: var(--pkp-color-transparent);
}

.pkpButton[data-type='primary'] {
	background-color: var(--pkp-color-primary);
	color: var(--pkp-text-color-on-dark);
}

.pkpButton[data-type='primary']:hover {
	background-color: var(--pkp-color-hover);
}

.pkpButton[data-type='primary']:disabled {
	background-color: var(--pkp-background-color-disabled);
}

.pkpButton[data-type='secondary'] {
	background-color: var(--pkp-color-transparent);
	border-color: var(--pkp-color-primary);
	color: var(--pkp-color-primary);
}

.pkpButton[data-type='secondary']:hover {
	background-color: var(--pkp-color-primary);
	border-color: var(--pkp-color-primary);
	color: var(--pkp-text-color-on-dark);
}

.pkpButton[data-type='secondary']:disabled {
	background-color: var(--pkp-color-transparent);
	border-color: var(--pkp-text-color-disabled);
	color: var(--pkp-text-color-disabled);
}
</style>
./BaseButton.vue
