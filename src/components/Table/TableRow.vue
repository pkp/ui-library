<template>
	<tr
		class="border-separate border border-light"
		:class="striped ? 'even:bg-tertiary' : 'bg-secondary'"
	>
		<slot></slot>
	</tr>
</template>

<script setup>
import {inject, onMounted, onUnmounted, ref, provide} from 'vue';

const tableContext = inject('tableContext', null);

defineProps({
	/** Enables striped styling for the row */
	striped: {type: Boolean, default: true},
});

const cellIndex = ref(0);

function registerCell() {
	return cellIndex.value++;
}

provide('registerCell', registerCell);

// Register the row when the component is mounted
onMounted(() => {
	if (tableContext) tableContext.registerRow();
	cellIndex.value = 0;
});

// Unregister the row when the component is unmounted
onUnmounted(() => {
	if (tableContext) tableContext.unregisterRow();
});
</script>
