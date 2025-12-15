<template>
	<textarea
		:id="textAreaId"
		class="pkpTextarea__element"
		:value="props.modelValue"
		:placeholder="props.placeholder"
		:disabled="props.disabled"
		@input="emit('update:modelValue', $event.target.value)"
	/>
</template>
<script setup>
import {inject} from 'vue';

const props = inject('textAreaProps');
const emit = inject('textAreaEmit');
const textAreaId = inject('textAreaId');
</script>
