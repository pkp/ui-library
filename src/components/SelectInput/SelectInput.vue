<template>
	<div :class="wrapperClass">
		<select
			v-model="selectedValue"
			v-bind="$attrs"
			class="disabled:cursor-not-allowed"
			:class="selectClass"
			:disabled="disabled"
			:aria-label="ariaLabel"
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
			v-if="isBorderless"
			class="pointer-events-none absolute right-0 h-4 w-4 text-primary"
			icon="Dropdown"
		/>
	</div>
</template>

<script setup>
import {computed} from 'vue';
import Icon from '@/components/Icon/Icon.vue';

defineOptions({inheritAttrs: false});

const props = defineProps({
	/** The selected value (v-model) */
	modelValue: {
		type: [String, Number],
		default: '',
	},
	/** Array of options with {value, label, disabled?} */
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
	/** Size of the control. 'large' sets the width to also fill the parent container. */
	size: {
		type: String,
		default: 'normal',
		validator: (value) => ['normal', 'large'].includes(value),
	},
	/** Visual variant. 'borderless' drops the native border and adds a chevron, for inline usage. */
	variant: {
		type: String,
		default: 'default',
		validator: (value) => ['default', 'borderless'].includes(value),
	},
});

const emit = defineEmits(['update:modelValue']);

const isBorderless = computed(() => props.variant === 'borderless');

const selectedValue = computed({
	get: () => props.modelValue,
	set: (value) => emit('update:modelValue', value),
});

const wrapperClass = computed(() => ({
	'relative inline-flex items-center': isBorderless.value,
	'w-full': props.size === 'large',
}));

const selectClass = computed(() => ({
	'cursor-pointer appearance-none border-none bg-transparent pr-6 text-base-normal focus:outline-none focus:ring-0':
		isBorderless.value,
	'w-full': props.size === 'large',
}));
</script>
