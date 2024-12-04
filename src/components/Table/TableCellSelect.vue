<template>
	<TableCell>
		<input
			type="checkbox"
			:checked="props.checked"
			:aria-describedby="describedBy"
			@change="emit('change', $event.target.checked)"
		/>
	</TableCell>
</template>

<script setup>
import TableCell from './TableCell.vue';

const props = defineProps({
	checked: {type: Boolean, required: true},
	describedBy: {type: String, required: true},
});
const emit = defineEmits(['change']);
</script>
