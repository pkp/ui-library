<template>
	<tbody
		class="[&>tr:not(:last-child)>td]:!border-b-0 [&>tr:not(:last-child)>th:not([rowspan])]:!border-b-0"
	>
		<slot />
	</tbody>
</template>

<script setup>
import {provide} from 'vue';

const props = defineProps({
	/** Group identifier for this row group */
	groupId: {type: [String, Number], required: true},
	/** Total number of rows in this group */
	groupSize: {type: Number, required: true},
});

// Provide group context to child TableRows
provide('rowSpanGroupContext', {
	groupId: props.groupId,
	groupSize: props.groupSize,
});
</script>
