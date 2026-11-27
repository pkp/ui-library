<template>
	<svg
		:class="cn('root')"
		viewBox="0 0 800 800"
		xmlns="http://www.w3.org/2000/svg"
		aria-hidden="true"
	>
		<circle
			cx="400"
			cy="400"
			fill="none"
			r="200"
			stroke-width="50"
			stroke="currentColor"
			stroke-dasharray="700 1400"
			stroke-linecap="round"
		/>
	</svg>
</template>

<script setup>
import {usePkpStyles} from '@/frontend/composables/usePkpStyles.js';

const props = defineProps({
	styles: {type: Object, default: () => ({})},
});

const {cn} = usePkpStyles('PkpSpinner', props.styles);
</script>

<style lang="css">
@keyframes pkpspinner__spin {
	to {
		transform: rotate(360deg);
	}
}

.PkpSpinner {
	transform-origin: center;
	animation: pkpspinner__spin 1s linear infinite;
}
</style>
