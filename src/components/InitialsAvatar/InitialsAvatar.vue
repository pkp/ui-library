<template>
	<div :class="classes">
		<span v-if="initials">{{ initials }}</span>
		<Icon v-else icon="User" :class="shrink ? 'h-3 w-3' : 'h-5 w-5'"></Icon>
	</div>
</template>

<script setup>
import {computed} from 'vue';
import Icon from '../Icon/Icon.vue';
const props = defineProps({
	/** If the background should use primary color (blue) */
	isPrimary: {
		type: Boolean,
		default: true,
	},
	/** If the background should use secondary color (white) */
	isSecondary: {
		type: Boolean,
		default: false,
	},
	/** If the background should use negative color (red) */
	isWarnable: {
		type: Boolean,
		default: false,
	},
	/** Use the disabled text color (gray) */
	isDisabled: {
		type: Boolean,
		default: false,
	},
	/** Whether the avatar should be smaller in size */
	shrink: {
		type: Boolean,
		default: false,
	},
	/** Initials to display */
	initials: {
		type: String,
		required: true,
	},
});

const classes = computed(() => ({
	// Base
	'inline-flex items-center justify-center align-middle rounded-full p-1 cursor-pointer': true,
	'h-8 w-8 text-3xl-medium': !props.shrink,
	'h-5 w-5 text-base-normal': props.shrink,
	// Default
	'bg-primary text-on-dark hover:text-on-dark hover:bg-hover':
		props.isPrimary && !props.isSecondary && !props.isWarnable,
	// Is secondary
	'bg-secondary': props.isSecondary,
	'text-primary': props.isSecondary && !props.isDisabled,
	// Is warnable
	'bg-negative text-on-dark': props.isWarnable,
	// Is disabled
	'text-disabled': props.isDisabled,
}));
</script>
