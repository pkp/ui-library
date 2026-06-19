<template>
	<tr
		class="border-separate border border-light"
		:class="{
			'even:bg-tertiary': striped,
			'bg-secondary': !striped && !isInTableBodyGroup,
		}"
	>
		<slot></slot>
	</tr>
</template>

<script setup>
import {inject, provide, computed, onUnmounted} from 'vue';

const tableContext = inject('tableContext', null);
// Two separate grouping features: groupId comes from TableRowGroupWrapper, the body-group
// marker from TableBodyGroup (used to detect rowspan grouping and drop this row's background).
const groupId = inject('groupId', null);
const isInTableBodyGroup = inject('isInTableBodyGroup', false);

const props = defineProps({
	/** Enables striped styling for the row */
	striped: {type: Boolean, default: true},
	/**
	 * Mark the first row of a rowspan group — the row whose cells span the group,
	 * e.g. `:is-first-row-in-group="index === 0"`. The remaining rows are covered by
	 * those spanning cells: their cells read the provided `isCoveredByRowSpan` to skip
	 * spanning cells and shift their leading border.
	 */
	isFirstRowInGroup: {type: Boolean, default: false},
});

// A row is "covered" when it sits under a spanning cell — i.e. inside a body group and
// not its first row. Gated by the group marker so standalone rows keep normal borders.
provide(
	'isCoveredByRowSpan',
	computed(() => isInTableBodyGroup && !props.isFirstRowInGroup),
);

if (tableContext) tableContext.registerRow(groupId);

onUnmounted(() => {
	if (tableContext) tableContext.unregisterRow(groupId);
});
</script>
