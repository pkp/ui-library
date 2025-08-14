<template>
	<div :class="classes">
		<span v-if="initials">{{ initials }}</span>
		<PkpIcon
			v-else
			icon="User"
			:class="
				shrink ? 'avatar-initials__icon--small' : 'avatar-initials__icon--large'
			"
		/>
	</div>
</template>

<script setup>
import {computed} from 'vue';
import PkpIcon from '@/frontend/components/PkpIcon/PkpIcon.vue';

const props = defineProps({
	isPrimary: {type: Boolean, default: true},
	isSecondary: {type: Boolean, default: false},
	isWarnable: {type: Boolean, default: false},
	isDisabled: {type: Boolean, default: false},
	shrink: {type: Boolean, default: false},
	initials: {type: String, required: true},
});

const classes = computed(() => ({
	'avatar-initials': true,
	'avatar-initials--small': props.shrink,
	'avatar-initials--large': !props.shrink,
	'avatar-initials--primary':
		props.isPrimary && !props.isSecondary && !props.isWarnable,
	'avatar-initials--secondary': props.isSecondary,
	'avatar-initials--warnable': props.isWarnable,
	'avatar-initials--disabled': props.isDisabled,
}));
</script>

<style scoped>
.avatar-initials {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	vertical-align: middle;
	border-radius: 50%;
	padding: 0.25rem;
	cursor: pointer;
}

.avatar-initials--large {
	height: 3rem;
	width: 3rem;
	font-size: 1.25rem;
	font-weight: 500;
}

.avatar-initials--small {
	height: 2rem;
	width: 2rem;
	font-size: 1rem;
	font-weight: 400;
}

.avatar-initials--primary {
	background-color: var(--pkp-color-primary);
	color: var(--pkp-text-color-on-dark);
}

.avatar-initials--primary:hover {
	background-color: var(--pkp-color-hover);
	color: var(--pkp-text-color-on-dark);
}

.avatar-initials--secondary {
	background-color: var(--pkp-background-color-secondary);
}

.avatar-initials--secondary:not(.avatar-initials--disabled) {
	color: var(--pkp-color-primary);
}

.avatar-initials--warnable {
	background-color: var(--pkp-color-negative);
	color: var(--pkp-text-color-on-dark);
}

.avatar-initials--disabled {
	color: var(--pkp-background-color-disabled);
}

/* Icon sizes */
.avatar-initials__icon--large {
	height: 1.25rem;
	width: 1.25rem;
}

.avatar-initials__icon--small {
	height: 0.75rem;
	width: 0.75rem;
}
</style>
