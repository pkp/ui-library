<template>
	<div class="relative inline-flex items-center">
		<select
			v-model="selectedValue"
			class="cursor-pointer appearance-none border-none bg-transparent pr-6 text-base-normal focus:outline-none focus:ring-0"
			:aria-label="ariaLabel"
			:disabled="disabled"
		>
			<option v-if="placeholder" value="" disabled>
				{{ placeholder }}
			</option>
			<option
				v-for="option in options"
				:key="option.value"
				:value="option.value"
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
import {computed} from 'vue';
import Icon from '@/components/Icon/Icon.vue';

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
		default: '',
	},
	/** Accessible label for screen readers */
	ariaLabel: {
		type: String,
		default: '',
	},
	/** Whether the select is disabled */
	disabled: {
		type: Boolean,
		default: false,
	},
});

const emit = defineEmits(['update:modelValue']);

const selectedValue = computed({
	get: () => props.modelValue,
	set: (value) => emit('update:modelValue', value),
});
</script>
