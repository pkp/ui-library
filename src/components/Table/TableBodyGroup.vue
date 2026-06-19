<template>
	<tbody
		class="bg-secondary even:bg-tertiary [&>tr:not(:last-child)>td]:!border-b-0 [&>tr:not(:last-child)>th:not([rowspan])]:!border-b-0"
	>
		<slot />
	</tbody>
</template>

<script setup>
import {provide} from 'vue';

// Marker so child TableRows skip their own background and let the group's striped
// <tbody> background show through. Structural parent<->child contract only — the
// rowspan count and covered state are passed explicitly as props by the consumer.
provide('isInTableBodyGroup', true);
</script>
