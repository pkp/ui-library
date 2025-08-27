<template>
	<BaseTextarea v-bind="$attrs" class="pkpTextarea">
		<BaseTextareaLabel class="pkpTextarea__label" />
		<BaseTextareaInput class="pkpTextarea__element" />
	</BaseTextarea>
</template>
<script setup>
import BaseTextarea from './BaseTextarea.vue';
import BaseTextareaLabel from './BaseTextareaLabel.vue';
import BaseTextareaInput from './BaseTextareaInput.vue';
</script>
<style>
.pkpTextarea {
	display: flex;
	flex-direction: column;
	gap: var(--pkp-spacing-1);
}

.pkpTextarea__label {
	font: var(--pkp-font-base-normal);
	color: var(--pkp-color-primary);
}

.pkpTextarea__element {
	background-color: var(--pkp-background-color-secondary);
	border: 1px solid var(--pkp-border-color-light);
	border-radius: var(--pkp-radius);
	padding: var(--pkp-spacing-2);
	font: var(--pkp-font-base-normal);
	color: var(--pkp-text-color-default);
	height: 120px;
	resize: vertical;
}

.pkpTextarea__element:focus {
	outline: none;
	border-color: var(--pkp-color-hover);
	box-shadow: 0 0 0 2px rgba(0, 103, 152, 0.2); /* derived from primary */
}

.pkpTextarea__element:disabled {
	background-color: var(--pkp-background-color-disabled);
	color: var(--pkp-text-color-disabled);
	cursor: not-allowed;
}
</style>
