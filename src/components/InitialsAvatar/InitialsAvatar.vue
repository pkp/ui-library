<template>
	<div :class="classes">
		<span v-if="initials">{{ initials }}</span>
		<Icon v-else icon="User" class="h-5 w-5"></Icon>
	</div>
</template>

<script setup>
import {computed} from 'vue';
import Icon from '../Icon/Icon.vue';
const props = defineProps({
	givenName: {
		type: String,
		required: true,
	},
	familyName: {
		type: String,
		default: '',
	},
	isPrimary: {
		type: Boolean,
		default: true,
	},
	isSecondary: {
		type: Boolean,
		default: false,
	},
	isWarnable: {
		type: Boolean,
		default: false,
	},
	shrink: {
		type: Boolean,
		default: false,
	},
});

const initials = computed(() => {
	return `${props.givenName?.charAt(0) || ''}${props.familyName?.charAt(0) || ''}`.toUpperCase();
});

const classes = computed(() => ({
	// Base
	'inline-flex items-center justify-center align-middle rounded-full p-1 text-3xl-medium cursor-pointer': true,
	'h-8 w-8': !props.shrink,
	'h-5 w-5': props.shrink,
	// Default
	'bg-primary text-on-dark hover:text-on-dark hover:bg-hover':
		props.isPrimary && !props.isSecondary && !props.isWarnable,
	// Is secondary
	'bg-secondary text-primary': props.isSecondary,
	'bg-negative text-on-dark': props.isWarnable,
}));
</script>
