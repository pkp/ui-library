<template>
	<button :class="styles" :aria-label="ariaLabel" :disabled="isDisabled">
		<Icon class="h-6 w-6" :icon="icon" aria-hidden="true" />
	</button>
</template>

<script setup>
import {computed} from 'vue';
import Icon from '@/components/Icon/Icon.vue';

const props = defineProps({
	/** Icon name to be displayed within the button */
	icon: {
		type: String,
		required: true,
	},
	/** Accessible label for the button. */
	ariaLabel: {
		type: String,
		default: null,
	},
	/** Indicates whether the button is in an active state. */
	isActive: {
		type: Boolean,
		default: false,
	},
	/** Disables the button, making it unclickable and styled as disabled */
	isDisabled: {
		type: Boolean,
		default: false,
	},
});

const styles = computed(() => ({
	// Base
	'inline-flex relative items-center justify-center text-lg-semibold rounded w-6 h-6': true,
	// Default
	'text-primary': !props.isActive,
	// Hover
	'hover:text-on-dark hover:bg-hover': !props.isDisabled,
	// Active
	'text-on-dark bg-selection-dark border-transparent': props.isActive,
	// Disabled
	'hover:text-disabled hover:bg-secondary !text-disabled cursor-not-allowed':
		props.isDisabled,
}));
</script>
