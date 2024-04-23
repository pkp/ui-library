<template>
	<TransitionRoot as="template" :show="opened">
		<HLDialog class="modal" @close="onClose">
			<TransitionChild
				as="template"
				enter="ease-out duration-300"
				enter-from="opacity-0"
				enter-to="opacity-100"
				leave="ease-in duration-200"
				leave-from="opacity-100"
				leave-to="opacity-0"
			>
				<div
					class="fixed inset-0 z-10 bg-blur bg-opacity-75 transition-opacity"
				/>
			</TransitionChild>
			<div class="fixed inset-0 z-20 overflow-y-auto">
				<div
					class="flex min-h-full items-end justify-center p-4 text-center sm:items-start sm:p-0"
				>
					<TransitionChild
						as="template"
						enter="ease-out duration-300"
						enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
						enter-to="opacity-100 translate-y-0 sm:scale-100"
						leave="ease-in duration-200"
						leave-from="opacity-100 translate-y-0 sm:scale-100"
						leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
					>
						<DialogPanel
							class="modal__panel modal__panel--dialog relative mx-3 w-10/12 max-w-3xl transform overflow-hidden rounded bg-secondary text-start shadow transition-all sm:my-8"
						>
							<div class="flex min-h-12 items-center">
								<DialogTitle
									v-if="dialogProps.title"
									class="m-0 min-w-[1px] overflow-x-hidden overflow-ellipsis whitespace-nowrap px-4 py-2 text-xl-bold"
								>
									{{ dialogProps.title }}
								</DialogTitle>
								<button
									class="me-2 ms-auto cursor-pointer border-0 bg-transparent text-center"
									@click="onClose"
								>
									<icon
										class="h-6 w-6 text-negative"
										icon="Cancel"
										:aria-hidden="true"
									/>
									<span class="-screenReader">
										{{ dialogProps.closeLabel || t('common.close') }}
									</span>
								</button>
							</div>
							<div class="modal-content p-4">
								<div v-html="dialogProps.message" />
							</div>
							<div class="flex items-center justify-end p-4">
								<spinner v-if="isLoading" />
								<pkp-button
									v-for="action in dialogProps.actions"
									:key="action.label"
									class="ms-2"
									:element="action.element || 'button'"
									:href="action.href || null"
									:is-primary="action.isPrimary || null"
									:is-warnable="action.isWarnable || null"
									:is-disabled="isLoading"
									@click="
										action.callback ? fireCallback(action.callback) : null
									"
								>
									{{ action.label }}
								</pkp-button>
							</div>
						</DialogPanel>
					</TransitionChild>
				</div>
			</div>
		</HLDialog>
	</TransitionRoot>
</template>

<script setup>
import {ref, computed, onMounted, onUnmounted, watch} from 'vue';
import {storeToRefs} from 'pinia';

import {
	Dialog as HLDialog,
	DialogTitle,
	DialogPanel,
	TransitionRoot,
	TransitionChild,
} from '@headlessui/vue';

import {useModalStore} from '@/stores/modalStore';

const myLevel = ref(0);
const modalStore = useModalStore();
const {dialogProps, dialogOpened, dialogLevel} = storeToRefs(modalStore);

const {closeDialog, increaseDialogLevel, decreaseDialogLevel} = modalStore;

const opened = computed(
	() => dialogOpened.value && myLevel.value === dialogLevel.value,
);

const isLoading = ref(false);

// resetting state after close
// this is not ideal approach, but given how little state the dialog has
// its less complex than splitting dialog into two components to have proper life cycle
// as we do with SideModal and SideModalBody
watch(opened, (prevOpened, nextOpened) => {
	if (prevOpened === true && nextOpened === false) {
		isLoading.value = false;
	}
});

function onClose() {
	console.log('onClose:', dialogProps.value.close);
	if (dialogProps.value.close) {
		dialogProps.value.close();
	}
	closeDialog();
}

function fireCallback(callback) {
	isLoading.value = true;
	if (typeof callback === 'function') {
		callback(() => {
			onClose();
		});
	}
}

onMounted(() => {
	increaseDialogLevel();
	myLevel.value = dialogLevel.value;
});

onUnmounted(() => {
	decreaseDialogLevel();
});
</script>

<style scoped>
.modal-content > p:first-child {
	margin-top: 0;
}

.modal-content > p:last-child {
	margin-bottom: 0;
}
</style>
