<template>
	<div class="relative inline-flex items-center" :class="selectWidthClass">
		<FormFieldLabel
			v-if="label"
			:control-id="controlId"
			:label="label"
			class="me-2 text-base-normal"
		/>
		<select
			:id="controlId"
			v-model="selectedValue"
			class="cursor-pointer appearance-none border-none bg-transparent pr-6 text-base-normal focus:outline-none focus:ring-0"
			:aria-label="ariaLabel"
			:disabled="disabled"
			:class="selectWidthClass"
		>
			<option v-if="placeholder" value="" disabled>
				{{ placeholder }}
			</option>
			<option
				v-for="option in options"
				:key="option.value"
				:value="option.value"
				:disabled="option.disabled"
			>
				{{ option.label }}
			</option>
		</select>
		<Icon
			class="pointer-events-none absolute right-0 h-4 w-4 text-primary"
			icon="Dropdown"
		/>
	</div>
</template>

<script setup>
import {computed, useId} from 'vue';
import Icon from '@/components/Icon/Icon.vue';
import FormFieldLabel from '@/components/Form/FormFieldLabel.vue';

const controlId = useId();

const props = defineProps({
	/** The selected value (v-model) */
	modelValue: {
		type: [String, Number],
		default: '',
	},
	/** Array of options with {value, label} objects */
	options: {
		type: Array,
		required: true,
		validator: (options) =>
			options.every((opt) => 'value' in opt && 'label' in opt),
	},
	/** Placeholder text shown when no value is selected */
	placeholder: {
		type: String,
		default: null,
	},
	/** Visible label rendered before the select. When omitted, only ariaLabel is used. */
	label: {
		type: String,
		default: null,
	},
	/** Accessible label for screen readers */
	ariaLabel: {
		type: String,
		default: null,
	},
	/** Whether the select is disabled */
	disabled: {
		type: Boolean,
		default: false,
	},
	/** Size of the select, affecting the length of the select element */
	size: {
		type: String,
		default: 'normal',
		validator: (value) => ['normal', 'large'].includes(value),
	},
});

const emit = defineEmits(['update:modelValue']);

const selectedValue = computed({
	get: () => props.modelValue,
	set: (value) => emit('update:modelValue', value),
});

const selectWidthClass = computed(() => {
	return {
		'w-full': props.size === 'large',
	};
});
</script>
