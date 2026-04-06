<template>
	<button
		v-bind="$attrs"
		:class="cn('root')"
		:disabled="isDisabled"
		@click="handleClick"
	>
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

const emit = defineEmits(['action']);

const {cn} = usePkpStyles('PkpButton', props.styles);

function handleClick(event) {
	emit('action', {pkp, event});
}
</script>
