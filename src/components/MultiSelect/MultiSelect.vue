<template>
	<SelectRoot v-model="selectedValue" multiple :disabled="disabled">
		<SelectTrigger
			:id="triggerId"
			:aria-label="ariaLabel"
			:aria-labelledby="labelledBy"
			:aria-describedby="ariaDescribedby"
			class="flex w-full items-start justify-between gap-2 rounded border border-light bg-secondary px-3 py-2 text-start text-lg-normal text-default outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-50 data-[state=open]:border-primary"
		>
			<span
				class="min-w-0 break-words"
				:class="{'text-secondary': !selectedLabels}"
			>
				{{ selectedLabels || placeholder }}
			</span>
			<Icon
				icon="ChevronDown"
				class="h-4 w-4 shrink-0 text-primary"
				:aria-hidden="true"
			/>
		</SelectTrigger>
		<SelectPortal>
			<SelectContent
				position="popper"
				:side-offset="4"
				class="z-50 w-[var(--reka-select-trigger-width)] overflow-hidden rounded border border-light bg-secondary shadow"
			>
				<SelectViewport class="max-h-72 overflow-y-auto p-1">
					<SelectItem
						v-for="option in options"
						:key="option.value"
						:value="option.value"
						:disabled="option.disabled"
						class="flex cursor-pointer items-center gap-2 rounded px-2 py-2 text-lg-normal text-default outline-none data-[disabled]:cursor-not-allowed data-[highlighted]:bg-selection-light data-[disabled]:text-disabled data-[disabled]:opacity-60"
					>
						<Icon
							:icon="isSelected(option.value) ? 'CheckboxTicked' : 'Checkbox'"
							class="h-5 w-5 shrink-0 text-primary"
							:aria-hidden="true"
						/>
						<SelectItemText>{{ option.label }}</SelectItemText>
					</SelectItem>
				</SelectViewport>
			</SelectContent>
		</SelectPortal>
	</SelectRoot>
</template>

<script setup>
import {computed, useId} from 'vue';
import {
	SelectRoot,
	SelectTrigger,
	SelectPortal,
	SelectContent,
	SelectViewport,
	SelectItem,
	SelectItemText,
} from 'reka-ui';
import Icon from '@/components/Icon/Icon.vue';
import {t} from '@/utils/i18n';

const triggerId = useId();

const props = defineProps({
	/** The selected values (v-model). Array of option `value`s. */
	modelValue: {
		type: Array,
		default: () => [],
	},
	/** Array of options with {value, label, disabled?} objects. */
	options: {
		type: Array,
		required: true,
		validator: (options) =>
			options.every((opt) => 'value' in opt && 'label' in opt),
	},
	/** Text shown in the trigger when nothing is selected. */
	placeholder: {
		type: String,
		default: null,
	},
	/** Accessible label for screen readers when there is no visible label. */
	ariaLabel: {
		type: String,
		default: null,
	},
	/** Id(s) of an external label element associated with the control. */
	labelledBy: {
		type: String,
		default: null,
	},
	/** Id(s) of element(s) that describe the control (description/error). */
	ariaDescribedby: {
		type: String,
		default: null,
	},
	/** Whether the whole control is disabled. */
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

/** Comma-separated labels of the selected options, in option order. */
const selectedLabels = computed(() =>
	props.options
		.filter((option) => props.modelValue.includes(option.value))
		.map((option) => option.label)
		.join(t('common.commaListSeparator')),
);

function isSelected(value) {
	return props.modelValue.includes(value);
}
</script>
