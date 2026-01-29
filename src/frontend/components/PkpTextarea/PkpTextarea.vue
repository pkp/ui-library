<template>
	<div :class="cn('root')">
		<Label :for="textAreaId" :class="[cn('label'), {'sr-only': isLabelSrOnly}]">
			{{ label }}
		</Label>
		<textarea
			:id="textAreaId"
			:class="cn('element')"
			:value="modelValue"
			:placeholder="placeholder"
			:disabled="disabled"
			@input="$emit('update:modelValue', $event.target.value)"
		/>
	</div>
</template>

<script setup>
import {useId} from 'vue';
import {Label} from 'reka-ui';
import {usePkpStyles} from '@/frontend/composables/usePkpStyles.js';

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
	// Whether the label should be visually hidden but still accessible to screen readers
	isLabelSrOnly: {
		type: Boolean,
		default: false,
	},
	styles: {
		type: Object,
		default: () => ({}),
	},
});

defineEmits(['update:modelValue']);

const {cn} = usePkpStyles(props.styles);
const textAreaId = useId();
</script>

<style>
.PkpTextarea__element {
	/* Ensure font inheritance (browsers don't do this for form elements) */
	font-family: inherit;
	/* Predictable box model */
	box-sizing: border-box;
	/* Fill container width by default */
	width: 100%;
}
</style>
