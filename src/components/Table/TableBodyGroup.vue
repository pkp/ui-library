<template>
	<tbody
		class="[&>tr:not(:last-child)>td]:!border-b-0 [&>tr:not(:last-child)>th:not([rowspan])]:!border-b-0"
	>
		<slot />
	</tbody>
</template>

<script setup>
import {provide, ref, inject, computed} from 'vue';

const tableContext = inject('tableContext', null);

const props = defineProps({
	/** Group identifier for this row group */
	groupId: {type: [String, Number], required: true},
	/** Total number of rows in this group */
	groupSize: {type: Number, required: true},
});

// Get a sequential group index from the table
const groupIndex = tableContext?.registerRowSpanGroupIndex?.() ?? 0;

// Track child rows for reactive isFirst detection
const rowIds = ref([]);

const registerGroupRow = () => {
	const id = Symbol();
	rowIds.value.push(id);
	return {id, isFirst: computed(() => rowIds.value[0] === id)};
};

const unregisterGroupRow = (id) => {
	const idx = rowIds.value.indexOf(id);
	if (idx !== -1) rowIds.value.splice(idx, 1);
};

// Provide group context to child TableRows
provide('rowSpanGroupContext', {
	groupId: props.groupId,
	get groupSize() {
		return props.groupSize;
	},
	groupIndex,
	registerGroupRow,
	unregisterGroupRow,
});
</script>
