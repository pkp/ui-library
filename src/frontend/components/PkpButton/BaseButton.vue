<template>
	<button
		v-bind="$attrs"
		class="BaseButton"
		:data-type="isSecondary ? 'secondary' : 'primary'"
	>
		<slot />
	</button>
</template>

<script setup>
defineProps({
	isSecondary: {
		type: Boolean,
		default: false,
	},
});
</script>
