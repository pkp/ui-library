<template>
	<button v-bind="$attrs" :class="cn('root')" :disabled="isDisabled">
		<slot />
	</button>
</template>

<script setup>
import {usePkpStyles} from '@/frontend/composables/usePkpStyles.js';

const props = defineProps({
	isDisabled: {
		type: Boolean,
		default: false,
	},
	styles: {
		type: Object,
		default: () => ({}),
	},
});

const {cn} = usePkpStyles('PkpButton', props.styles);
</script>
