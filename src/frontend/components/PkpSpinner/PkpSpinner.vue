<template>
	<span class="pkpSpinner" :class="spinnerClass" aria-hidden="true">
		<span v-if="message" class="pkpSpinner__message">
			{{ message }}
		</span>
	</span>
</template>

<script setup>
import {computed} from 'vue';

const props = defineProps({
	message: {required: false, type: String, default: null},
	sizeVariant: {
		required: false,
		type: String,
		default: () => 'default',
		validator: (prop) => ['default', 'big'].includes(prop),
	},
});

const spinnerClass = computed(() => {
	return props.sizeVariant === 'big' ? 'pkpSpinner--big' : '';
});
</script>

<style>
.pkpSpinner::before {
	display: inline-block;
	position: relative;
	width: calc(1.25 * var(--pkp-text-base-size));
	height: calc(1.25 * var(--pkp-text-base-size));
	vertical-align: middle;
	animation: pkpSpinnerRotate 0.6s linear infinite;
	border-radius: 100%;
	border-top: 1px solid var(--pkp-color-primary);
	border-bottom: 1px solid var(--pkp-color-transparent);
	border-left: 1px solid var(--pkp-color-primary);
	border-right: 1px solid var(--pkp-color-transparent);
	content: '';
	opacity: 1;
}

.pkpSpinner--big::before {
	width: calc(2 * var(--pkp-text-base-size));
	height: calc(2 * var(--pkp-text-base-size));
	border-top: 3px solid var(--pkp-color-primary);
	border-bottom: 3px solid var(--pkp-color-transparent);
	border-left: 3px solid var(--pkp-color-primary);
	border-right: 3px solid var(--pkp-color-transparent);
}

.pkpSpinner__message {
	margin-left: var(--pkp-spacing-3);
	font: var(--pkp-font-base-normal);
	color: var(--pkp-text-color-disabled);
}

/* Animation */
@keyframes pkpSpinnerRotate {
	0% {
		transform: rotateZ(-360deg);
	}
	100% {
		transform: rotateZ(0deg);
	}
}
</style>
