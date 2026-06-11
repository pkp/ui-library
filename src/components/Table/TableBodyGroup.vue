<template>
	<tbody
		class="bg-secondary even:bg-tertiary [&>tr:not(:last-child)>td]:!border-b-0 [&>tr:not(:last-child)>th:not([rowspan])]:!border-b-0"
	>
		<slot />
	</tbody>
</template>

<script setup>
import {provide, reactive, toRef} from 'vue';

const props = defineProps({
	/** Total number of rows in this group. Used by spanning cells for their rowspan. */
	groupSize: {type: Number, default: 1},
});

// Rows register themselves so each can tell if it's the first row of the group.
const rowUids = reactive([]);

provide('rowSpanGroup', {
	size: toRef(props, 'groupSize'),
	register: (uid) => rowUids.push(uid),
	unregister: (uid) => {
		const index = rowUids.indexOf(uid);
		if (index !== -1) rowUids.splice(index, 1);
	},
	isCoveredByRowSpan: (uid) => rowUids.indexOf(uid) > 0,
});
</script>
