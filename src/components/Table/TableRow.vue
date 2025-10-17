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
const groupId = inject('groupId', null);
const rowIndex = ref(0);

defineProps({
	/** Enables striped styling for the row */
	striped: {type: Boolean, default: true},
});

// Register the row when the component is mounted
onMounted(() => {
	if (tableContext) tableContext.registerRow(groupId);
	rowIndex.value = tableContext.rowCount.value;
});

// Unregister the row when the component is unmounted
onUnmounted(() => {
	if (tableContext) tableContext.unregisterRow(groupId);
	rowIndex.value = tableContext.rowCount.value;
});

provide('rowIndex', rowIndex);
</script>
