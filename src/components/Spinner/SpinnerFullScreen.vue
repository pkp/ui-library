<template>
	<div
		v-if="progressStore.isFullScreenSpinner"
		class="pkpSpinnerFullScreen fixed inset-0 z-50 flex items-center justify-center bg-default bg-opacity-75"
	>
		<Spinner size-variant="big" />
	</div>
</template>

<script setup>
import Spinner from '@/components/Spinner/Spinner.vue';
import {useProgressStore} from '@/stores/progressStore';

const progressStore = useProgressStore();
</script>

<style>
@keyframes pkpSpinnerFullScreenAppear {
	from {
		opacity: 0;
	}
	to {
		opacity: 1;
	}
}

/*
 * The overlay blocks interaction from the first frame, but stays invisible
 * for the duration of the side modal slide-out. So a reload triggered by
 * closing a modal never draws over the closing animation, and a fast request
 * that finishes within the delay never flashes a spinner at all.
 */
.pkpSpinnerFullScreen {
	animation: pkpSpinnerFullScreenAppear 150ms ease-out
		var(--pkp-side-modal-duration, 450ms) backwards;
}
</style>
