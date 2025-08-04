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
});

const buttonClass = computed(() => {
	return [
		'pkp-button',
		props.isSecondary ? 'pkp-button--secondary' : 'pkp-button--primary',
	];
});
</script>

<style>
.pkp-button {
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

.pkp-button:disabled {
	background-color: var(--pkp-background-color-disabled);
	color: var(--pkp-text-color-disabled);
	cursor: not-allowed;
	border-color: var(--pkp-color-transparent);
}

.pkp-button--primary {
	background-color: var(--pkp-color-primary);
	color: var(--pkp-text-color-on-dark);
}

.pkp-button--primary:hover {
	background-color: var(--pkp-color-hover);
}

.pkp-button--primary:disabled {
	background-color: var(--pkp-background-color-disabled);
}

.pkp-button--secondary {
	background-color: var(--pkp-color-transparent);
	border-color: var(--pkp-color-primary);
	color: var(--pkp-color-primary);
}

.pkp-button--secondary:hover {
	background-color: var(--pkp-color-primary);
	border-color: var(--pkp-color-primary);
	color: var(--pkp-text-color-on-dark);
}

.pkp-button--secondary:disabled {
	background-color: var(--pkp-color-transparent);
	border-color: var(--pkp-text-color-disabled);
	color: var(--pkp-text-color-disabled);
}
</style>
