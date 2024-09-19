<template>
	<Icon
		v-if="iconOnly"
		class="h-5 w-5 text-primary"
		:icon="icon"
		aria-hidden="true"
	/>
	<button v-else :class="styles" :aria-label="ariaLabel">
		<Icon class="h-5 w-5" :icon="icon" aria-hidden="true" />
	</button>
</template>

<script setup>
import {computed} from 'vue';
import Icon from '@/components/Icon/Icon.vue';

const props = defineProps({
	icon: {
		type: String,
		required: true,
	},
	ariaLabel: {
		type: String,
		default: null,
	},
	iconOnly: {
		type: Boolean,
		default: false,
	},
	isActive: {
		type: Boolean,
		default: false,
	},
	isDisabled: {
		type: Boolean,
		default: false,
	},
});

const styles = computed(() => ({
	// Base
	'inline-flex relative items-center justify-center text-lg-semibold border-light border rounded w-10 h-10': true,
	// Color
	'text-primary bg-secondary': true,
	// Hover
	'hover:text-on-dark hover:bg-hover': true,
	// Active
	'text-on-dark bg-selection-dark border-transparent': props.isActive,
	'text-disabled': props.isDisabled,
}));
</script>
