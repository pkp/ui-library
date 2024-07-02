<template>
	<p>{{ registeredMessageAgencyPreamble }}</p>
	<p>{{ registeredMessage }}</p>
</template>

<script setup>
defineProps({
	registeredMessageAgencyPreamble: {type: String, required: true},
	registeredMessage: {type: String, required: true},
});
</script>
