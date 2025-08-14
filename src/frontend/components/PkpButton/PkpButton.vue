<template>
	<button :class="buttonClass" v-bind="$attrs">
		<slot name="left-icon" />
		<slot />
	</button>
</template>

<script setup>
import {computed} from 'vue';

const props = defineProps({
	isSecondary: {
		type: Boolean,
		default: false,
	},
	/** Use when this button represents an action such as delete, go back, revert or cancel. */
	isWarnable: Boolean,
});

const buttonClass = computed(() => {
	return [
		'pkpButton',
		props.isSecondary ? 'pkpButton--secondary' : 'pkpButton--primary',
		props.isWarnable ? 'pkpButton--warnable' : '',
	];
});
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

.pkpButton--primary {
	background-color: var(--pkp-color-primary);
	color: var(--pkp-text-color-on-dark);
}

.pkpButton--primary:hover {
	background-color: var(--pkp-color-hover);
}

.pkpButton--primary:disabled {
	background-color: var(--pkp-background-color-disabled);
}

.pkpButton--secondary {
	background-color: var(--pkp-color-transparent);
	border-color: var(--pkp-color-primary);
	color: var(--pkp-color-primary);
}

.pkpButton--secondary:hover {
	background-color: var(--pkp-color-primary);
	border-color: var(--pkp-color-primary);
	color: var(--pkp-text-color-on-dark);
}

.pkpButton--secondary:disabled {
	background-color: var(--pkp-color-transparent);
	border-color: var(--pkp-text-color-disabled);
	color: var(--pkp-text-color-disabled);
}

.pkpButton--warnable {
	color: var(--pkp-color-negative);
	border-color: var(--pkp-border-color-light);
	background-color: var(--pkp-background-color-secondary);
}

.pkpButton--warnable:disabled {
	color: var(--pkp-text-color-disabled);
}
.pkpButton--warnable:hover {
	background-color: var(--pkp-background-color-secondary);
}
</style>
