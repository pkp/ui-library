<template>
	<button
		v-bind="$attrs"
		class="BaseButton BaseButtonDisabled"
		:disabled="isDisabled"
	>
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
