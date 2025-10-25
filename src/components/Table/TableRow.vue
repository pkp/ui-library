<template>
	<tr
		class="border-separate border border-light"
		:class="striped ? 'even:bg-tertiary' : 'bg-secondary'"
	>
		<slot></slot>
	</tr>
</template>

<script setup>
import {inject, onMounted, onUnmounted} from 'vue';

const tableContext = inject('tableContext', null);
const groupId = inject('groupId', null);

defineProps({
	/** Enables striped styling for the row */
	striped: {type: Boolean, default: true},
});

// Register the row when the component is mounted
onMounted(() => {
	if (tableContext) tableContext.registerRow(groupId);
});

// Unregister the row when the component is unmounted
onUnmounted(() => {
	if (tableContext) tableContext.unregisterRow(groupId);
});
</script>
