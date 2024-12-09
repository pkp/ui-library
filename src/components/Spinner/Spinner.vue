<template>
	<span
		class="pkpSpinner"
		:class="{'pkpSpinner--big': sizeVariant === 'big'}"
		aria-hidden="true"
	>
		<span v-if="message" class="ms-3 text-base-normal text-disabled">
			{{ message }}
		</span>
	</span>
</template>
<script setup>
defineProps({
	message: {required: false, type: String, default: null},
	sizeVariant: {
		required: false,
		type: String,
		default: () => 'default',
		validator: (prop) => ['default', 'big'].includes(prop),
	},
});
</script>
<style lang="less">
@import '../../styles/_import';

.pkpSpinner {
	&:before {
		display: inline-block;
		position: relative;
		width: 1.25rem;
		height: 1.25rem;
		vertical-align: middle;
		animation: pkp_anim_spinner 0.6s linear infinite;
		border-radius: 100%;
		border-top: 1px solid @primary;
		border-bottom: 1px solid transparent;
		border-left: 1px solid @primary;
		border-right: 1px solid transparent;
		content: '';
		opacity: 1;
	}
}

.pkpSpinner--big {
	&:before {
		width: 2rem;
		height: 2rem;
		border-top: 3px solid @primary;
		border-bottom: 3px solid transparent;
		border-left: 3px solid @primary;
		border-right: 3px solid transparent;
	}
}

// Animation
@keyframes pkp_anim_spinner {
	0% {
		transform: rotateZ(-360deg);
	}
	100% {
		transform: rotateZ(0deg);
	}
}
</style>
