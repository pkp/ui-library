<template>
	<TransitionRoot as="template" :show="open">
		<HLDialog as="div" class="relative z-10" @close="handleClose">
			<TransitionChild
				as="template"
				enter="ease-in-out duration-500"
				enter-from="opacity-0"
				enter-to="opacity-100"
				leave="ease-in-out duration-500"
				leave-from="opacity-100"
				leave-to="opacity-0"
			>
				<div class="fixed inset-0 bg-blur transition-opacity" />
			</TransitionChild>

			<div class="fixed inset-0 overflow-hidden">
				<div class="absolute inset-0 overflow-hidden">
					<div
						class="pointer-events-none fixed inset-y-0 flex max-w-full ltr:right-0 ltr:pl-10 rtl:left-0 rtl:pr-10"
					>
						<TransitionChild
							as="template"
							enter="transform transition ease-in-out duration-500"
							enter-from="ltr:translate-x-full rtl:-translate-x-full"
							enter-to="translate-x-0"
							leave="transform transition ease-in-out duration-500"
							leave-from="translate-x-0"
							leave-to="ltr:translate-x-full rtl:-translate-x-full"
						>
							<div>
								<slot />
							</div>
						</TransitionChild>
					</div>
				</div>
			</div>
		</HLDialog>
	</TransitionRoot>
</template>

<script setup>
import {ref, provide, defineProps, defineEmits} from 'vue';
import {
	Dialog as HLDialog,
	TransitionRoot,
	TransitionChild,
} from '@headlessui/vue';

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

const closeCallbacks = ref([]);
function registerCloseCallback(callback) {
	closeCallbacks.value.push(callback);
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
</script>
