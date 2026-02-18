<template>
	<tr
		class="border-separate border border-light"
		:class="{
			'even:bg-tertiary': striped,
			'bg-secondary': !striped && !rowSpanGroupContext?.groupId,
		}"
	>
		<slot></slot>
	</tr>
</template>

<script setup>
import {inject, provide, onMounted, onUnmounted, computed} from 'vue';

const tableContext = inject('tableContext', null);
const groupId = inject('groupId', null);
const rowSpanGroupContext = inject('rowSpanGroupContext', null);

defineProps({
	/** Enables striped styling for the row */
	striped: {type: Boolean, default: true},
});

// Register with group for reactive isFirst tracking
const groupRowReg = rowSpanGroupContext?.registerGroupRow?.();

// Provide row group info to descendant cells
provide(
	'isContinuationRow',
	groupRowReg ? computed(() => !groupRowReg.isFirst.value) : false,
);

// Register the row when the component is mounted
onMounted(() => {
	if (tableContext) tableContext.registerRow(groupId);
});

// Unregister the row when the component is unmounted
onUnmounted(() => {
	if (tableContext) tableContext.unregisterRow(groupId);
	if (groupRowReg) rowSpanGroupContext.unregisterGroupRow(groupRowReg.id);
});
</script>
