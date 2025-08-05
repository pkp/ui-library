<template>
	<div class="pkp-textarea">
		<Label class="pkp-textarea__label" :for="textareaId">
			{{ props.label }}
		</Label>
		<textarea
			:id="textareaId"
			class="pkp-textarea__element"
			:value="props.modelValue"
			:placeholder="props.placeholder"
			:disabled="props.disabled"
			@input="$emit('update:modelValue', $event.target.value)"
		/>
	</div>
</template>

<script setup>
import {Label} from 'reka-ui';
import {defineProps, defineEmits, useId} from 'vue';

const props = defineProps({
	label: {
		type: String,
		default: '',
	},
	modelValue: {
		type: String,
		default: '',
	},
	placeholder: {
		type: String,
		default: '',
	},
	disabled: {
		type: Boolean,
		default: false,
	},
});

defineEmits(['update:modelValue']);

const textareaId = useId();
</script>

<style>
.pkp-textarea {
	display: flex;
	flex-direction: column;
	gap: var(--pkp-spacing-1);
}

.pkp-textarea__label {
	font: var(--pkp-font-base-normal);
	color: var(--pkp-color-primary);
}

.pkp-textarea__element {
	background-color: var(--pkp-background-color-secondary);
	border: 1px solid var(--pkp-border-color-light);
	border-radius: var(--pkp-radius);
	padding: var(--pkp-spacing-2);
	font: var(--pkp-font-base-normal);
	color: var(--pkp-text-color-default);
	height: 120px;
	resize: vertical;
}

.pkp-textarea__element:focus {
	outline: none;
	border-color: var(--pkp-color-hover);
	box-shadow: 0 0 0 2px rgba(0, 103, 152, 0.2); /* derived from primary */
}

.pkp-textarea__element:disabled {
	background-color: var(--pkp-background-color-disabled);
	color: var(--pkp-text-color-disabled);
	cursor: not-allowed;
}
</style>
