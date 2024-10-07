<template>
	<tr class="border-separate border border-light even:bg-tertiary">
		<slot></slot>
	</tr>
</template>

<script setup>
import {inject, onMounted, onUnmounted} from 'vue';

// Inject the register and unregister functions from TableBody
const registerRow = inject('registerRow', null);
const unregisterRow = inject('unregisterRow', null);

// Register the row when the component is mounted
onMounted(() => {
	if (registerRow) registerRow();
});

// Unregister the row when the component is unmounted
onUnmounted(() => {
	if (unregisterRow) unregisterRow();
});
</script>
