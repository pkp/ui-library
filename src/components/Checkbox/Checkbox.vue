<template>
	<label
		class="flex select-none items-center text-base-normal"
		:class="{'w-5': !label}"
	>
		<input
			type="checkbox"
			class="peer sr-only"
			:checked="checked"
			:aria-labelledby="props.labelledBy"
			:disabled="disabled"
			@change="emit('change', $event)"
		/>
		<span
			class="relative flex h-5 w-5 items-center justify-center peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-1 peer-focus-visible:outline-[--tw-ring-color]"
			:class="{
				'cursor-pointer text-primary': !disabled,
				'cursor-not-allowed text-disabled opacity-50': disabled,
				'mr-2': label,
			}"
			style="--tw-ring-color: -webkit-focus-ring-color"
		>
			<Icon :icon="icon" class="h-5 w-5"></Icon>
		</span>
		{{ label }}
	</label>
</template>

<script setup>
import {computed} from 'vue';
import Icon from '@/components/Icon/Icon.vue';

const props = defineProps({
	// text label displayed next to the checkbox
	label: {type: String, default: () => ''},
	// whether the checkbox is checked
	checked: {type: Boolean, required: true},
	// id(s) of an external label element. Must be provided if label is missing
	labelledBy: {type: String, required: true},
	// whether the checkbox is disabled
	disabled: {type: Boolean, required: false, default: () => false},
});

const emit = defineEmits(['change']);

const icon = computed(() => (props.checked ? 'CheckboxTicked' : 'Checkbox'));
</script>
