<template>
	<tr
		class="border-separate border border-light"
		:class="{
			'even:bg-tertiary': striped,
			'bg-secondary': !striped && rowSpanGroupSize === null,
		}"
	>
		<slot></slot>
	</tr>
</template>

<script setup>
import {inject, provide, onMounted, onUnmounted, toRef} from 'vue';

const tableContext = inject('tableContext', null);
const groupId = inject('groupId', null);
const rowSpanGroupSize = inject('rowSpanGroupSize', null);

const props = defineProps({
	/** Enables striped styling for the row */
	striped: {type: Boolean, default: true},
	/** Marks this row as a continuation of a row-spanning group (not the first row). Cells with rowspan > 1 will be skipped. */
	isContinuation: {type: Boolean, default: false},
});

provide('isContinuationRow', toRef(props, 'isContinuation'));

onMounted(() => {
	if (tableContext) tableContext.registerRow(groupId);
});

onUnmounted(() => {
	if (tableContext) tableContext.unregisterRow(groupId);
});
</script>
