<template>
  <span class="pkpSpinner" aria-hidden="true" />
</template>

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
		border-top: 1px solid @shade;
		border-bottom: 1px solid transparent;
		border-left: 1px solid @shade;
		border-right: 1px solid transparent;
		border-top-color: rgba(0, 0, 0, 0.5);
		border-left-color: rgba(0, 0, 0, 0.5);
		content: '';
		opacity: 1;
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
