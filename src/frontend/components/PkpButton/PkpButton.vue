<template>
	<button v-bind="$attrs" class="PkpButton" :disabled="isDisabled">
		<slot />
	</button>
</template>

<script setup>
defineProps({
	isDisabled: {
		type: Boolean,
		default: false,
	},
});
</script>
