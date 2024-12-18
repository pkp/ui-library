<template>
	<tr class="border-separate border border-light even:bg-tertiary">
		<slot></slot>
	</tr>
</template>

<script setup>
import {inject, onMounted, onUnmounted} from 'vue';

const tableContext = inject('tableContext', null);

// Register the row when the component is mounted
onMounted(() => {
	if (tableContext) tableContext.registerRow();
});

// Unregister the row when the component is unmounted
onUnmounted(() => {
	if (tableContext) tableContext.unregisterRow();
});
</script>
