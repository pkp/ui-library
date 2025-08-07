<template>
	<DialogRoot :open="open" @update:open="handleRootClose">
		<DialogPortal>
			<div v-bind="$attrs">
				<DialogOverlay class="pkpModal__overlay" />
				<slot />
			</div>
		</DialogPortal>
	</DialogRoot>
</template>

<script setup>
import {ref, provide, defineProps, defineEmits} from 'vue';
import {DialogRoot, DialogPortal, DialogOverlay} from 'reka-ui';

const props = defineProps({
	open: {
		type: Boolean,
		required: true,
	},
	modalLevel: {
		type: Number,
		required: false,
		default: 0,
	},
});

const emit = defineEmits(['close']);

const closeModalButton = ref(null);
const closeCallbacks = ref([]);

function registerCloseCallback(callback) {
	closeCallbacks.value.push(callback);
}

function handleRootClose(opened) {
	// apply it only if the SideModal is still opened, this is to address issue from
	// cypress tests which managed to click on overlay while the side modal was closing
	// to trigger additional close
	if (!opened && props.open) {
		handleClose();
	}
}

function handleClose(data) {
	let canClose = true;
	closeCallbacks.value.forEach((callback) => (canClose = callback()));
	if (canClose) {
		emit('close', data);
	}
}

provide('closeModal', handleClose);
provide('registerCloseCallback', registerCloseCallback);
provide('modalLevel', ref(props.modalLevel));
provide('closeModalButton', closeModalButton);
</script>

<style>
@keyframes pkpModalFadeIn {
	from {
		opacity: 0;
	}
	to {
		opacity: 1;
	}
}

@keyframes pkpModalFadeOut {
	from {
		opacity: 1;
	}
	to {
		opacity: 0;
	}
}

.pkpModal__overlay[data-state='open'] {
	animation: pkpModalFadeIn 300ms ease-out;
}

.pkpModal__overlay[data-state='closed'] {
	animation: pkpModalFadeOut 300ms ease-in;
}

.pkpModal__overlay {
	position: fixed;
	inset: 0;
	background-color: var(--pkp-background-color-blur);
}
</style>
