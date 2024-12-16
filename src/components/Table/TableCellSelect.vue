<template>
	<TableCell>
		<input
			:class="{'sr-only': disabled}"
			type="checkbox"
			:checked="props.checked"
			:aria-describedby="describedBy"
			:disabled="disabled"
			@change="emit('change', $event.target.checked)"
		/>
	</TableCell>
</template>

<script setup>
import TableCell from './TableCell.vue';

const props = defineProps({
	checked: {type: Boolean, required: true},
	describedBy: {type: String, required: true},
	disabled: {type: Boolean, required: false, default: false},
});
const emit = defineEmits(['change']);
</script>
