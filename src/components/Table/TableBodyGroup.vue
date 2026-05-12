<template>
	<tbody
		class="bg-secondary even:bg-tertiary [&>tr:not(:last-child)>td]:!border-b-0 [&>tr:not(:last-child)>th:not([rowspan])]:!border-b-0"
	>
		<slot />
	</tbody>
</template>

<script setup>
import {provide, toRef} from 'vue';

const props = defineProps({
	/** Total number of rows in this group. Provided to descendant cells that need it for rowspan. */
	groupSize: {type: Number, default: 1},
});

provide('rowSpanGroupSize', toRef(props, 'groupSize'));
</script>
