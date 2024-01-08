<template>
	<TransitionRoot as="template" :show="opened">
		<HLDialog class="modal" :class="'modal--popup'" @close="onClose">
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
					class="bg-gray-500 fixed inset-0 z-10 bg-opacity-75 transition-opacity"
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
							class="modal__panel modal__panel--dialog rounded-lg shadow-xl relative mx-3 w-10/12 max-w-3xl transform overflow-hidden bg-lightest text-left transition-all sm:my-8"
						>
							<div class="modal__header">
								<DialogTitle v-if="dialogProps.title" class="modal__title">
									{{ dialogProps.title }}
								</DialogTitle>
								<button class="modal__closeButton" @click="onClose">
									<span :aria-hidden="true">×</span>
									<span class="-screenReader">
										{{ dialogProps.closeLabel || t('common.close') }}
									</span>
								</button>
							</div>
							<div class="modal__content">
								<div v-html="dialogProps.message" />
							</div>
							<div class="modal__footer">
								<spinner v-if="dialogProps.isLoading" />
								<pkp-button
									v-for="action in dialogProps.actions"
									:key="action.label"
									:element="action.element || 'button'"
									:href="action.href || null"
									:is-primary="action.isPrimary || null"
									:is-warnable="action.isWarnable || null"
									:is-disabled="dialogProps.isLoading"
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
import {ref, computed, onMounted, onUnmounted} from 'vue';
import {storeToRefs} from 'pinia';

import {
	Dialog as HLDialog,
	DialogTitle,
	DialogPanel,
	TransitionRoot,
	TransitionChild,
} from '@headlessui/vue';

import {useDialogStore} from '@/stores/dialogStore';
const modalLevel = ref(0);
const dialogStore = useDialogStore();
const {dialogProps, dialogOpened, currentLevel} = storeToRefs(dialogStore);
const {closeDialog} = dialogStore;

const opened = computed(
	() => dialogOpened.value && modalLevel.value === currentLevel.value,
);

const isLoading = ref(false);

function onClose() {
	isLoading.value = false;
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
	currentLevel.value = currentLevel.value + 1;
	modalLevel.value = currentLevel.value;
});

onUnmounted(() => {
	currentLevel.value = currentLevel.value - 1;
});
/*export default {
	props: {
		actions: {
			type: Array,
			required: true,
		},
		open: {
			type: Boolean,
			required: true,
		},
		close: {
			type: Function,
			default() {
				return () => {};
			},
		},
		closeLabel: {
			type: String,
		},
		message: {
			type: String,
			required: true,
		},
		title: {
			type: String,
			default() {
				return '';
			},
		},
	},*/
</script>
