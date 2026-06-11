<template>
	<tr
		class="border-separate border border-light"
		:class="{
			'even:bg-tertiary': striped,
			'bg-secondary': !striped && !rowSpanGroup,
		}"
	>
		<slot></slot>
	</tr>
</template>

<script setup>
import {inject, provide, computed, onUnmounted, useId} from 'vue';

const tableContext = inject('tableContext', null);
// Two separate grouping features: groupId comes from TableRowGroupWrapper, rowSpanGroup from TableBodyGroup
const groupId = inject('groupId', null);
const rowSpanGroup = inject('rowSpanGroup', null);

defineProps({
	/** Enables striped styling for the row */
	striped: {type: Boolean, default: true},
});

const uid = useId();

// True for rows after the first in a rowspan group — those covered by its spanning cells.
const isCoveredByRowSpan = computed(() =>
	rowSpanGroup ? rowSpanGroup.isCoveredByRowSpan(uid) : false,
);
provide('isCoveredByRowSpan', isCoveredByRowSpan);

// Register in setup, not onMounted, so cells can rely on it on first render
if (rowSpanGroup) rowSpanGroup.register(uid);
if (tableContext) tableContext.registerRow(groupId);

onUnmounted(() => {
	if (rowSpanGroup) rowSpanGroup.unregister(uid);
	if (tableContext) tableContext.unregisterRow(groupId);
});
</script>
