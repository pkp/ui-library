<template>
	<div class="pkpFormField">
		<div class="pkpFormField__control">
			<label :key="value" class="pkpFormField--options__option">
				<input
					v-model="selectedValue"
					class="pkpFormField--options__input"
					type="checkbox"
					:name="name"
					:checked="value"
					:disabled="disabled"
				/>
				{{ label }}
			</label>
		</div>
	</div>
</template>

<script setup>
import {ref, watch} from 'vue';
const emit = defineEmits(['change']);

const props = defineProps({
	/** Field key used for the form */
	name: {
		type: String,
		default: null,
	},
	/** Label to show for the checkbox */
	label: {
		type: String,
		default: () => '',
	},
	/** Current value of the field */
	value: {
		type: Array,
		default: () => [],
	},
	/** If the checkbox field is disabled */
	disabled: {
		type: Boolean,
		default: () => false,
	},
});

const selectedValue = ref(props.value);

// emit the event to update the value of the checkbox
watch(selectedValue, (val) => {
	emit('change', props.name, 'value', val);
});

// update the selected value when the prop changes
watch(
	() => props.value,
	(val) => {
		selectedValue.value = val;
	},
);
</script>
