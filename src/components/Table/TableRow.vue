<template>
	<tr class="border-separate border border-light" :class="rowClasses">
		<slot></slot>
	</tr>
</template>

<script setup>
import {inject, provide, onMounted, onUnmounted, computed} from 'vue';

const tableContext = inject('tableContext', null);
const groupId = inject('groupId', null);
const rowSpanGroupContext = inject('rowSpanGroupContext', null);

const props = defineProps({
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

const rowClasses = computed(() => {
	// Auto-shade based on groupIndex (odd groups) when inside TableBodyGroup
	if (rowSpanGroupContext) {
		return rowSpanGroupContext.groupIndex % 2 === 1
			? 'bg-tertiary'
			: 'bg-secondary';
	}
	return props.striped ? 'even:bg-tertiary' : 'bg-secondary';
});

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
