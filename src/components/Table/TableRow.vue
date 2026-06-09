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
import {
	inject,
	provide,
	computed,
	onBeforeMount,
	onMounted,
	onUnmounted,
	getCurrentInstance,
} from 'vue';

const tableContext = inject('tableContext', null);
const groupId = inject('groupId', null);
const rowSpanGroup = inject('rowSpanGroup', null);

defineProps({
	/** Enables striped styling for the row */
	striped: {type: Boolean, default: true},
});

const uid = getCurrentInstance().uid;

// True for rows after the first in a rowspan group — those covered by its spanning cells.
const isCoveredByRowSpan = computed(() =>
	rowSpanGroup ? rowSpanGroup.isCoveredByRowSpan(uid) : false,
);
provide('isCoveredByRowSpan', isCoveredByRowSpan);

// Register before render so it's correct on first paint.
onBeforeMount(() => rowSpanGroup?.register(uid));

onMounted(() => {
	if (tableContext) tableContext.registerRow(groupId);
});

onUnmounted(() => {
	rowSpanGroup?.unregister(uid);
	if (tableContext) tableContext.unregisterRow(groupId);
});
</script>
