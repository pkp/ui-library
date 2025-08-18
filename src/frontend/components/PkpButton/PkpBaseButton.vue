<template>
	<button
		:class="buttonClass"
		v-bind="$attrs"
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
